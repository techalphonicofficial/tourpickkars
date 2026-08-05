'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useSearchParams, useRouter } from 'next/navigation';
import { getBookingDetail, submitBookingDetail } from "@/services/bookingForm";
import { apiEndpoint } from "@/services/config";

// Empty member template
const emptyMember = {
  name: '',
  contact: '',
  dob: '',
  idProofType: '',
  idProofNumber: '',
  idProofFile: null,
  gender: '',
  email: '',
  emergencyName: '',
  emergencyContact: '',
  emergencyRelation: '',
  allocatedActivity: '' // To track which activity this member is assigned to
};

// Validation patterns for different ID types
const idValidationPatterns = {
  'Aadhar Card': /^\d{4}\s?\d{4}\s?\d{4}$|^\d{12}$/,
  'Voter ID': /^[A-Z]{3}[0-9]{7}$/i,
  'Passport': /^[A-Z][0-9]{7}$/i,
  'Driving License': /^[A-Z]{2}[0-9]{13}$|^[A-Z]{2}[0-9]{2}[0-9]{11}$/i,
};

// Validation messages for different ID types
const idValidationMessages = {
  'Aadhar Card': 'Enter 12-digit Aadhar number (e.g., 1234 5678 9012 or 123456789012)',
  'Voter ID': 'Enter valid Voter ID (e.g., ABC1234567)',
  'Passport': 'Enter valid Passport number (e.g., A1234567)',
  'Driving License': 'Enter valid Driving License number',
};

// Validation helper functions
const validateIndianPhone = (phone) => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone);
};

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateAge = (dob) => {
  const today = new Date();
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age >= 1;
};

const validateIdNumber = (type, number) => {
  if (!type || !number) return false;
  const pattern = idValidationPatterns[type];
  return pattern ? pattern.test(number.replace(/\s/g, '')) : true;
};

// Local storage key generator
const getStorageKey = (bookingId, memberIndex) => {
  return `booking_${bookingId}_member_${memberIndex}`;
};

function BookingFormInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get('id');

  // Add a ref to track initial load
  const initialLoadDone = useRef(false);

  const [memberCount, setMemberCount] = useState(1);
  const [members, setMembers] = useState([{ ...emptyMember }]);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!!id);
  const [error, setError] = useState(null);
  const [bookingDetail, setBookingDetail] = useState(null);
  const [invalidIdError, setInvalidIdError] = useState(false);
  const [activityAllocation, setActivityAllocation] = useState({
    quad: 0,
    double: 0,
    triple: 0
  });
  const [dataLoadedFromStorage, setDataLoadedFromStorage] = useState(false);
  const [showLoadFromStorage, setShowLoadFromStorage] = useState(false);
  const [storageDataAvailable, setStorageDataAvailable] = useState([]);

  // New state for step form
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [isEditingMode, setIsEditingMode] = useState(false);

  const isValidUUID = (uuid) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  };

  useEffect(() => {
    if (id && !isValidUUID(id)) {
      setInvalidIdError(true);
      setInitialLoading(false);
      setError('Invalid booking ID format. Please check the URL.');
    }
  }, [id]);

  // Helper function to check if any storage data exists
  const checkAnyStorageData = (bookingId, totalMembers) => {
    try {
      for (let i = 0; i < totalMembers; i++) {
        const key = getStorageKey(bookingId, i);
        if (localStorage.getItem(key)) {
          return true;
        }
      }
    } catch (error) {
      console.error('Error checking storage:', error);
    }
    return false;
  };

  // Check for available storage data when booking ID and members are available
  useEffect(() => {
    if (id && members.length > 0 && !initialLoading) {
      checkStorageAvailability();
    }
  }, [id, members.length, initialLoading]);

  // Auto-load from storage if data exists for all members
  useEffect(() => {
    if (id && members.length > 0 && !dataLoadedFromStorage && !initialLoading) {
      const availableData = checkStorageAvailability();
      if (availableData.length === members.length) {
        // Auto-load if all members have saved data
        loadFromLocalStorage();
        setDataLoadedFromStorage(true);
      } else if (availableData.length > 0) {
        // Show option to load if some data exists
        setShowLoadFromStorage(true);
        setStorageDataAvailable(availableData);
      }
    }
  }, [id, members.length, initialLoading]);

  // Save current member data to local storage whenever it changes
  useEffect(() => {
    if (id && members[currentStep] && !initialLoading) {
      saveToLocalStorage(currentStep, members[currentStep]);
    }
  }, [members[currentStep], currentStep, id, initialLoading]);

  // Check for completed members when members change
  useEffect(() => {
    const completed = [];
    members.forEach((member, index) => {
      if (isMemberComplete(index)) {
        completed.push(index);
      }
    });
    setCompletedSteps(completed);
  }, [members]);

  // Function to check if storage data exists for any members
  const checkStorageAvailability = () => {
    try {
      const available = [];
      members.forEach((_, index) => {
        const key = getStorageKey(id, index);
        const savedData = localStorage.getItem(key);
        if (savedData) {
          available.push(index);
        }
      });
      return available;
    } catch (error) {
      console.error('Error checking storage availability:', error);
      return [];
    }
  };

  // Function to save member data to local storage
  const saveToLocalStorage = (index, memberData) => {
    try {
      const key = getStorageKey(id, index);
      // Don't save file objects to localStorage
      const dataToSave = { ...memberData };
      delete dataToSave.idProofFile; // Remove file object as it can't be stored

      // Add flag to indicate file was uploaded
      if (memberData.idProofFile) {
        dataToSave.hasFile = true;
        dataToSave.fileName = memberData.idProofFile.name;
        dataToSave.fileType = memberData.idProofFile.type;
        dataToSave.fileSize = memberData.idProofFile.size;
      }

      localStorage.setItem(key, JSON.stringify(dataToSave));
      // console.log(`Saved member ${index + 1} to local storage`);
    } catch (error) {
      console.error('Error saving to local storage:', error);
    }
  };

  // Function to load member data from local storage
  const loadFromLocalStorage = () => {
    try {
      const updatedMembers = [...members];
      let hasStoredData = false;

      members.forEach((_, index) => {
        const key = getStorageKey(id, index);
        const savedData = localStorage.getItem(key);

        if (savedData) {
          try {
            const parsedData = JSON.parse(savedData);
            // Merge saved data with current member, preserving file objects
            updatedMembers[index] = {
              ...updatedMembers[index],
              ...parsedData,
              idProofFile: updatedMembers[index].idProofFile // Keep existing file if any
            };
            hasStoredData = true;
            // console.log(`Loaded member ${index + 1} from local storage`);

            // Mark field as touched for validation
            const fields = [
              'name', 'contact', 'dob', 'gender',
              'idProofType', 'idProofNumber',
              'emergencyName', 'emergencyContact', 'emergencyRelation'
            ];

            const newTouched = { ...touched };
            fields.forEach(field => {
              if (parsedData[field]) {
                newTouched[`${index}-${field}`] = true;
              }
            });
            setTouched(newTouched);

          } catch (e) {
            console.error(`Error parsing saved data for member ${index}:`, e);
          }
        }
      });

      if (hasStoredData) {
        setMembers(updatedMembers);
        setDataLoadedFromStorage(true);
        setShowLoadFromStorage(false);

        // Check which members are complete after loading
        const completed = [];
        updatedMembers.forEach((member, index) => {
          if (isMemberComplete(index)) {
            completed.push(index);
          }
        });
        setCompletedSteps(completed);
      }
    } catch (error) {
      console.error('Error loading from local storage:', error);
    }
  };

  // Function to load data for specific members only
  const loadSpecificMembersFromStorage = (indices) => {
    try {
      const updatedMembers = [...members];

      indices.forEach(index => {
        const key = getStorageKey(id, index);
        const savedData = localStorage.getItem(key);

        if (savedData) {
          try {
            const parsedData = JSON.parse(savedData);
            updatedMembers[index] = {
              ...updatedMembers[index],
              ...parsedData,
              idProofFile: updatedMembers[index].idProofFile
            };
            // console.log(`Loaded member ${index + 1} from local storage`);

            // Mark field as touched for validation
            const fields = [
              'name', 'contact', 'dob', 'gender',
              'idProofType', 'idProofNumber',
              'emergencyName', 'emergencyContact', 'emergencyRelation'
            ];

            const newTouched = { ...touched };
            fields.forEach(field => {
              if (parsedData[field]) {
                newTouched[`${index}-${field}`] = true;
              }
            });
            setTouched(newTouched);

          } catch (e) {
            console.error(`Error parsing saved data for member ${index}:`, e);
          }
        }
      });

      setMembers(updatedMembers);
      setShowLoadFromStorage(false);

      // Check which members are complete after loading
      const completed = [];
      updatedMembers.forEach((member, index) => {
        if (isMemberComplete(index)) {
          completed.push(index);
        }
      });
      setCompletedSteps(completed);

    } catch (error) {
      console.error('Error loading from local storage:', error);
    }
  };

  // Function to clear local storage for a specific member
  const clearMemberFromStorage = (index) => {
    try {
      const key = getStorageKey(id, index);
      localStorage.removeItem(key);
      // console.log(`Cleared member ${index + 1} from local storage`);
    } catch (error) {
      console.error('Error clearing from local storage:', error);
    }
  };

  // Function to clear all local storage for this booking
  const clearAllStorage = () => {
    try {
      members.forEach((_, index) => {
        const key = getStorageKey(id, index);
        localStorage.removeItem(key);
      });
      // console.log('Cleared all local storage for this booking');
    } catch (error) {
      console.error('Error clearing all storage:', error);
    }
  };

  // Function to check if a member is complete (all required fields filled)
  const isMemberComplete = (index) => {
    const member = members[index];
    return (
      member.name?.trim() !== '' &&
      member.contact?.trim() !== '' &&
      member.dob?.trim() !== '' &&
      member.gender?.trim() !== '' &&
      member.idProofType?.trim() !== '' &&
      member.idProofNumber?.trim() !== '' &&
      member.emergencyName?.trim() !== '' &&
      member.emergencyContact?.trim() !== '' &&
      member.emergencyRelation?.trim() !== ''
    );
  };

  // Function to get member status
  const getMemberStatus = (index) => {
    if (completedSteps.includes(index)) {
      return 'completed';
    }
    if (currentStep === index) {
      return 'current';
    }
    if (index < currentStep && !completedSteps.includes(index)) {
      return 'pending';
    }
    return 'upcoming';
  };

  // Handle step navigation
  const goToStep = (index) => {
    if (index < currentStep || completedSteps.includes(index) || index === 0) {
      setCurrentStep(index);
      setIsEditingMode(true);
    }
  };

  const goToNextStep = () => {
    if (currentStep < members.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Mark current member as completed and move to next
  const handleSaveAndContinue = () => {
    if (validateMember(currentStep, members[currentStep])) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep]);
      }

      // Save to local storage before moving to next
      saveToLocalStorage(currentStep, members[currentStep]);

      if (currentStep < members.length - 1) {
        goToNextStep();
      } else {
        // All members completed, ready for submission
        alert('All members completed! You can now submit the form.');
      }
    } else {
      // Mark all fields as touched to show validation errors
      const fields = [
        'name', 'contact', 'dob', 'gender',
        'idProofType', 'idProofNumber', 'idProofFile',
        'emergencyName', 'emergencyContact', 'emergencyRelation'
      ];

      const newTouched = { ...touched };
      fields.forEach(field => {
        newTouched[`${currentStep}-${field}`] = true;
      });
      setTouched(newTouched);

      // Scroll to first error
      const errorElement = document.querySelector(`.is-invalid`);
      errorElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Fetch booking data if ID exists
  useEffect(() => {
    if (!id || invalidIdError) {
      setInitialLoading(false);
      return;
    }

    const fetchBooking = async () => {
      try {
        setLoading(true);
        setError(null);
        setInvalidIdError(false);
        const response = await getBookingDetail(id);
        const data = response.data;
        // console.log("booking response api data ", data);

        if (!data || Object.keys(data).length === 0) {
          setInvalidIdError(true);
          setError('Booking not found. The provided ID does not exist.');
          setInitialLoading(false);
          return;
        }

        setBookingDetail(data);

        // Calculate activity allocations from active_cost
        if (data.active_cost && Array.isArray(data.active_cost)) {
          const allocation = {
            quad: 0,
            double: 0,
            triple: 0
          };

          data.active_cost.forEach(item => {
            const activity = item.activity.toLowerCase();
            const quantity = item.quantity || 1;

            if (activity.includes('quard') || activity.includes('quad')) {
              allocation.quad += quantity;
            } else if (activity.includes('double')) {
              allocation.double += quantity;
            } else if (activity.includes('triple')) {
              allocation.triple += quantity;
            }
          });

          setActivityAllocation(allocation);

          // Calculate total members from allocations
          const totalMembers = allocation.quad + allocation.double + allocation.triple;
          setMemberCount(totalMembers || 1);

          // Create member array based on allocations - THIS IS THE BASE STRUCTURE
          const baseMembers = [];

          // Add Quad members
          for (let i = 0; i < allocation.quad; i++) {
            baseMembers.push({
              ...emptyMember,
              allocatedActivity: 'Quad Sharing'
            });
          }

          // Add Double members
          for (let i = 0; i < allocation.double; i++) {
            baseMembers.push({
              ...emptyMember,
              allocatedActivity: 'Double Sharing'
            });
          }

          // Add Triple members
          for (let i = 0; i < allocation.triple; i++) {
            baseMembers.push({
              ...emptyMember,
              allocatedActivity: 'Triple Sharing'
            });
          }

          // Check if we have saved local storage data
          const hasLocalStorageData = checkAnyStorageData(id, totalMembers);

          if (hasLocalStorageData) {
            // Load from local storage but preserve the base structure
            const loadedMembers = [...baseMembers];

            // Try to load each member's data from localStorage
            for (let i = 0; i < totalMembers; i++) {
              const key = getStorageKey(id, i);
              const savedData = localStorage.getItem(key);

              if (savedData) {
                try {
                  const parsedData = JSON.parse(savedData);
                  loadedMembers[i] = {
                    ...loadedMembers[i],
                    ...parsedData,
                    idProofFile: null // Reset file object as it can't be stored
                  };
                  // console.log(`Loaded member ${i + 1} from local storage`);
                } catch (e) {
                  console.error(`Error parsing saved data for member ${i}:`, e);
                }
              }
            }

            setMembers(loadedMembers);

            // Mark completed steps based on loaded data
            const completed = [];
            loadedMembers.forEach((member, index) => {
              if (member.name && member.contact && member.dob) {
                completed.push(index);
              }
            });
            setCompletedSteps(completed);

            setDataLoadedFromStorage(true);

          } else if (data.members && Array.isArray(data.members)) {
            // If no local storage but API has members, use API data
            const apiMembers = data.members.map((member, index) => ({
              name: member.name || '',
              contact: member.contact || '',
              dob: member.dob || '',
              idProofType: member.idProofType || '',
              idProofNumber: member.idProofNumber || '',
              idProofFile: null,
              gender: member.gender || '',
              email: member.email || '',
              emergencyName: member.emergencyName || '',
              emergencyContact: member.emergencyContact || '',
              emergencyRelation: member.emergencyRelation || '',
              allocatedActivity: member.allocatedActivity || baseMembers[index]?.allocatedActivity || ''
            }));

            setMembers(apiMembers);

            // Auto-complete steps for already filled members
            const completed = [];
            data.members.forEach((member, index) => {
              if (member.name && member.contact && member.dob) {
                completed.push(index);
              }
            });
            setCompletedSteps(completed);

          } else {
            // No data anywhere, use empty base members
            setMembers(baseMembers);
          }
        }

        initialLoadDone.current = true;
      } catch (err) {
        console.error("Error fetching booking:", err);
        if (err.response?.status === 404) {
          setInvalidIdError(true);
          setError(err.message);
        } else {
          setError(err.message || 'Failed to load booking details. Please try again.');
        }
      } finally {
        setLoading(false);
        setInitialLoading(false);
      }
    };

    fetchBooking();
  }, [id]);

  // Handle member count change
  const handleMemberChange = (count) => {
    const number = parseInt(count) || 1;
    setMemberCount(number);

    const updatedMembers = Array.from({ length: number }, (_, index) =>
      members[index] ? { ...members[index] } : { ...emptyMember }
    );

    setMembers(updatedMembers);
    setCurrentStep(0);
    setCompletedSteps([]);

    // Clear errors for new members
    const newErrors = { ...errors };
    Object.keys(newErrors).forEach(key => {
      if (parseInt(key.split('-')[0]) >= number) {
        delete newErrors[key];
      }
    });
    setErrors(newErrors);
  };

  // Handle input change
  const handleChange = (index, field, value) => {
    const updated = [...members];

    if (field === 'idProofFile' && value.target) {
      // Store the actual File object
      updated[index][field] = value.target.files[0];
    } else {
      updated[index][field] = value;
    }

    setMembers(updated);
    validateField(index, field, updated[index]);

    // Auto-save to local storage on change
    if (id) {
      saveToLocalStorage(index, updated[index]);
    }
  };

  // Handle blur
  const handleBlur = (index, field) => {
    setTouched(prev => ({
      ...prev,
      [`${index}-${field}`]: true
    }));
    validateField(index, field, members[index]);

    // Save to local storage on blur
    if (id) {
      saveToLocalStorage(index, members[index]);
    }
  };

  // Validate single field
  const validateField = (index, field, memberData) => {
    const errorKey = `${index}-${field}`;
    let errorMessage = '';

    switch (field) {
      case 'name':
        if (!memberData.name?.trim()) errorMessage = 'Name is required';
        else if (memberData.name.length < 3) errorMessage = 'Name must be at least 3 characters';
        break;

      case 'contact':
        if (!memberData.contact) errorMessage = 'Contact number is required';
        else if (!validateIndianPhone(memberData.contact)) errorMessage = 'Enter valid 10-digit Indian mobile number';
        break;

      case 'email':
        if (memberData.email && !validateEmail(memberData.email)) errorMessage = 'Enter valid email address';
        break;

      case 'dob':
        if (!memberData.dob) errorMessage = 'Date of birth is required';
        else if (!validateAge(memberData.dob)) errorMessage = 'You must be at least 18 years old';
        break;

      case 'gender':
        if (!memberData.gender) errorMessage = 'Please select gender';
        break;

      case 'idProofType':
        if (!memberData.idProofType) errorMessage = 'Please select ID proof type';
        break;

      case 'idProofNumber':
        if (!memberData.idProofNumber) errorMessage = 'ID proof number is required';
        else if (!validateIdNumber(memberData.idProofType, memberData.idProofNumber)) {
          errorMessage = idValidationMessages[memberData.idProofType] || 'Invalid ID number format';
        }
        break;

      case 'idProofFile':
        if (!memberData.idProofFile && !id) errorMessage = 'Please upload ID proof document';
        else if (memberData.idProofFile && memberData.idProofFile.size > 5 * 1024 * 1024) {
          errorMessage = 'File size should be less than 5MB';
        } else if (memberData.idProofFile && !['image/jpeg', 'image/png', 'application/pdf'].includes(memberData.idProofFile.type)) {
          errorMessage = 'Only JPG, PNG, or PDF files are allowed';
        }
        break;

      case 'emergencyName':
        if (!memberData.emergencyName?.trim()) errorMessage = 'Emergency contact name is required';
        break;

      case 'emergencyContact':
        if (!memberData.emergencyContact) errorMessage = 'Emergency contact number is required';
        else if (!validateIndianPhone(memberData.emergencyContact)) errorMessage = 'Enter valid 10-digit mobile number';
        break;

      case 'emergencyRelation':
        if (!memberData.emergencyRelation?.trim()) errorMessage = 'Relation is required';
        break;

      default:
        break;
    }

    setErrors(prev => ({
      ...prev,
      [errorKey]: errorMessage
    }));

    return !errorMessage;
  };

  // Validate all fields for a member
  const validateMember = (index, memberData) => {
    const fields = [
      'name', 'contact', 'dob', 'gender',
      'idProofType', 'idProofNumber', 'idProofFile',
      'emergencyName', 'emergencyContact', 'emergencyRelation'
    ];

    let isValid = true;
    fields.forEach(field => {
      if (!validateField(index, field, memberData)) {
        isValid = false;
      }
    });

    return isValid;
  };

  // Get validation class
  const getValidationClass = (index, field) => {
    const errorKey = `${index}-${field}`;
    if (!touched[errorKey]) return '';
    return errors[errorKey] ? 'is-invalid' : 'is-valid';
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all members
    let isValid = true;
    members.forEach((member, index) => {
      if (!validateMember(index, member)) {
        isValid = false;
      }
    });

    if (!isValid) {
      const errorElement = document.querySelector(`.is-invalid`);
      errorElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setLoading(true);

    try {
      // Initialize sharing details as an empty object
      const sharingDetails = {};

      // Get members by activity type
      const quadMembers = members.filter(m => m.allocatedActivity === 'Quad Sharing');
      const doubleMembers = members.filter(m => m.allocatedActivity === 'Double Sharing');
      const tripleMembers = members.filter(m => m.allocatedActivity === 'Triple Sharing');

      // Only add quad_sharing if count > 0
      if (quadMembers.length > 0) {
        sharingDetails.quad_sharing = {
          count: quadMembers.length,
          members: quadMembers.map((member, index) => ({
            member_number: index + 1,
            name: member.name,
            contact: member.contact,
            dob: member.dob,
            gender: member.gender,
            email: member.email || '',
            id_proof_type: member.idProofType,
            id_proof_number: member.idProofNumber,
            emergency_name: member.emergencyName,
            emergency_contact: member.emergencyContact,
            emergency_relation: member.emergencyRelation,
            has_file: !!member.idProofFile
          }))
        };
      }

      // Only add double_sharing if count > 0
      if (doubleMembers.length > 0) {
        sharingDetails.double_sharing = {
          count: doubleMembers.length,
          members: doubleMembers.map((member, index) => ({
            member_number: index + 1,
            name: member.name,
            contact: member.contact,
            dob: member.dob,
            gender: member.gender,
            email: member.email || '',
            id_proof_type: member.idProofType,
            id_proof_number: member.idProofNumber,
            emergency_name: member.emergencyName,
            emergency_contact: member.emergencyContact,
            emergency_relation: member.emergencyRelation,
            has_file: !!member.idProofFile
          }))
        };
      }

      // Only add triple_sharing if count > 0
      if (tripleMembers.length > 0) {
        sharingDetails.triple_sharing = {
          count: tripleMembers.length,
          members: tripleMembers.map((member, index) => ({
            member_number: index + 1,
            name: member.name,
            contact: member.contact,
            dob: member.dob,
            gender: member.gender,
            email: member.email || '',
            id_proof_type: member.idProofType,
            id_proof_number: member.idProofNumber,
            emergency_name: member.emergencyName,
            emergency_contact: member.emergencyContact,
            emergency_relation: member.emergencyRelation,
            has_file: !!member.idProofFile
          }))
        };
      }

      // Create the complete booking object
      const bookingData = {
        booking_info: {
          booking_id: bookingDetail?.id || id,
          full_name: bookingDetail?.name,
          email: bookingDetail?.email,
          phone: bookingDetail?.contact,
          package_id: bookingDetail?.package_id || '',
          package_title: bookingDetail?.package_title || '',
          duration: bookingDetail?.duration || '',
          pickup: bookingDetail?.pickup || '',
          drop: bookingDetail?.drop || '',
          start_date: bookingDetail?.start_date || '',
          end_date: bookingDetail?.end_date || ''
        },
        sharing_details: sharingDetails
      };
      // console.log("Booking data", bookingData);

      const response = await fetch(apiEndpoint("/booking/booking-information"), {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(bookingData)
      });

      const result = await response.json();

      if (result.success) {
        alert('Booking details submitted successfully!');

        // Clear local storage after successful submission
        clearAllStorage();

        if (!id) {
          setMembers([{ ...emptyMember }]);
          setMemberCount(1);
          setErrors({});
          setTouched({});
          setCurrentStep(0);
          setCompletedSteps([]);
        }
        window.location.href = '/';

      } else {
        throw new Error(result.message || 'Submission failed');
      }

    } catch (error) {
      console.error('Submission error:', error);
      alert(error.message || 'Failed to submit booking details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Function to clear saved data for current member
  const handleClearSavedData = () => {
    if (window.confirm('Are you sure you want to clear all saved data for this member?')) {
      clearMemberFromStorage(currentStep);

      // Reset current member to empty but preserve allocated activity
      const updatedMembers = [...members];
      updatedMembers[currentStep] = {
        ...emptyMember,
        allocatedActivity: members[currentStep].allocatedActivity
      };
      setMembers(updatedMembers);

      // Clear validation
      const fields = [
        'name', 'contact', 'dob', 'gender',
        'idProofType', 'idProofNumber', 'idProofFile',
        'emergencyName', 'emergencyContact', 'emergencyRelation'
      ];

      const newTouched = { ...touched };
      fields.forEach(field => {
        delete newTouched[`${currentStep}-${field}`];
      });
      setTouched(newTouched);

      const newErrors = { ...errors };
      fields.forEach(field => {
        delete newErrors[`${currentStep}-${field}`];
      });
      setErrors(newErrors);

      // Update completed steps
      const completed = completedSteps.filter(step => step !== currentStep);
      setCompletedSteps(completed);
    }
  };

  // Function to load all saved data
  const handleLoadAllSavedData = () => {
    if (window.confirm('Load all saved data from local storage? This will overwrite any current changes.')) {
      loadFromLocalStorage();
    }
  };

  // Function to load data for current member only
  const handleLoadCurrentMemberData = () => {
    if (window.confirm(`Load saved data for Member ${currentStep + 1}? This will overwrite any current changes.`)) {
      loadSpecificMembersFromStorage([currentStep]);
    }
  };

  // Function to manually clear all storage
  const handleManualClearAllStorage = () => {
    if (window.confirm('Are you sure you want to clear all saved data? This cannot be undone.')) {
      clearAllStorage();
      // Reset form but preserve allocated activities
      setMembers(members.map(m => ({ ...emptyMember, allocatedActivity: m.allocatedActivity })));
      setCompletedSteps([]);
      setCurrentStep(0);
      setErrors({});
      setTouched({});
    }
  };

  // Check if ID exists in URL
  if (!id) {
    return (
      <div className="container py-5">
        <div className="card shadow-sm border-0">
          <div className="card-body text-center p-5">
            <div className="mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" className="bi bi-exclamation-triangle-fill text-warning" viewBox="0 0 16 16">
                <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
              </svg>
            </div>
            <div className="display-6 fw-bold text-danger mb-3 h2">Missing Booking ID</div>
            <p className="lead mb-4">No booking ID was provided in the URL.</p>
            <div className="alert alert-warning d-inline-block mx-auto" role="alert" style={{ maxWidth: '500px' }}>
              <strong>Please check:</strong>
              <ul className="text-start mt-2 mb-0">
                <li>Make sure the URL includes a valid booking ID</li>
                <li>The correct format should be: <code>/booking-detail?id=YOUR_BOOKING_ID</code></li>
                <li>Contact your tour operator if you need the correct link</li>
              </ul>
            </div>
            <div className="mt-4">
              <button
                className="btn btn-primary px-4 py-2"
                onClick={() => window.location.href = '/'}
              >
                Go to Homepage
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state
  if (initialLoading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading booking details...</p>
      </div>
    );
  }

  // Show invalid ID error state
  if (invalidIdError) {
    return (
      <div className="container py-5">
        <div className="card shadow-sm border-0">
          <div className="card-body text-center p-5">
            <div className="mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" className="bi bi-exclamation-triangle-fill text-warning" viewBox="0 0 16 16">
                <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
              </svg>
            </div>
            <div className="display-6 fw-bold text-danger mb-3 h2">Invalid Booking URL</div>
            <p className="lead mb-4">{error || 'The booking ID provided is invalid or does not exist.'}</p>
            <div className="alert alert-warning d-inline-block mx-auto" role="alert" style={{ maxWidth: '500px' }}>
              <strong>Please check:</strong>
              <ul className="text-start mt-2 mb-0">
                <li>Make sure you have the correct URL with a valid booking ID</li>
                <li>Contact your tour operator if you believe this is an error</li>
                <li>Verify that the booking ID is complete and properly formatted</li>
              </ul>
            </div>
            <div className="mt-4">
              <button
                className="btn btn-primary px-4 py-2"
                onClick={() => window.location.href = '/'}
              >
                Go to Homepage
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          <div className="alert-heading h4">Error!</div>
          <p>{error}</p>
          <hr />
          <p className="mb-0">Please try again or contact support.</p>
        </div>
      </div>
    );
  }

  // Progress indicator for steps
  const renderStepIndicator = () => {
    return (
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="mb-0 h5">Member Progress</div>
          <span className="text-muted">
            Step {currentStep + 1} of {members.length}
          </span>
        </div>
        <div className="progress" style={{ height: '8px' }}>
          <div
            className="progress-bar"
            role="progressbar"
            style={{ width: `${((currentStep + 1) / members.length) * 100}%` }}
            aria-valuenow={((currentStep + 1) / members.length) * 100}
            aria-valuemin="0"
            aria-valuemax="100"
          ></div>
        </div>
        <div className="d-flex justify-content-between mt-2">
          {members.map((_, index) => {
            const status = getMemberStatus(index);
            return (
              <button
                key={index}
                type="button"
                onClick={() => goToStep(index)}
                className={`btn btn-sm rounded-circle step-indicator ${status === 'completed' ? 'btn-success' :
                  status === 'current' ? 'btn-primary' :
                    status === 'pending' ? 'btn-warning' :
                      'btn-outline-secondary'
                  }`}
                style={{ width: '30px', height: '30px', padding: '0' }}
                disabled={status === 'upcoming' && index > 0}
              >
                {status === 'completed' ? '✓' : index + 1}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="container py-4">
      <div className="card shadow-sm border-0">
        <div className="card-header text-white py-3" style={{ backgroundColor: '#00ba9d' }}>
          <div className="mb-0 fs-3 text-white h3">
            Update Booking Member Details
            {id && <span className="ms-2 badge bg-light rounded-1 text-primary">ID: {bookingDetail?.id}</span>}
          </div>
        </div>

        <div className="card-body p-4">
          {/* Package Summary */}
          {bookingDetail && (
            <div className="alert alert-info mb-4">
              <div className="alert-heading h5">Package: {bookingDetail.package_title}</div>
              <p className="mb-0">
                <strong>Duration:</strong> {bookingDetail.duration} |
                <strong> Pickup:</strong> {bookingDetail.pickup} |
                <strong> Drop:</strong> {bookingDetail.drop} |
                <strong> Dates:</strong> {bookingDetail.start_date} to {bookingDetail.end_date}
              </p>
            </div>
          )}

          {/* Activity Allocation Summary */}
          {(activityAllocation.quad > 0 || activityAllocation.double > 0 || activityAllocation.triple > 0) && (
            <div className="mb-4 p-3 bg-light rounded">
              <div className="fw-bold h6">Booking Summary</div>
              <div className="row">
                {activityAllocation.quad > 0 && (
                  <div className="col-auto">
                    <span className="badge bg-primary me-2 rounded-1 py-2 px-3">Quad Sharing: {activityAllocation.quad}</span>
                  </div>
                )}
                {activityAllocation.double > 0 && (
                  <div className="col-auto">
                    <span className="badge bg-success me-2 rounded-1 py-2 px-3">Double Sharing: {activityAllocation.double}</span>
                  </div>
                )}
                {activityAllocation.triple > 0 && (
                  <div className="col-auto">
                    <span className="badge bg-info me-2 rounded-1 py-2 px-3">Triple Sharing: {activityAllocation.triple}</span>
                  </div>
                )}
                <div className="col-auto">
                  <span className="badge bg-dark rounded-1 py-2 px-3">Total Members: {memberCount}</span>
                </div>
              </div>
            </div>
          )}

          {/* Step Indicator */}
          {renderStepIndicator()}

          {/* Local Storage Status and Load Options */}
          {id && (
            <div className="mb-3 d-flex justify-content-between align-items-center flex-wrap">
              <small className="text-muted">
                <i className="bi bi-cloud-check me-1"></i>
                Your progress is automatically saved locally
              </small>

              <div className="mt-2 mt-sm-0">
                {showLoadFromStorage && (
                  <>
                    <span className="badge bg-warning text-dark me-2 p-2">
                      <i className="bi bi-exclamation-triangle me-1"></i>
                      Saved data found for {storageDataAvailable.length} member(s)
                    </span>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={handleLoadAllSavedData}
                    >
                      Load All Saved Data
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary me-2"
                      onClick={handleLoadCurrentMemberData}
                    >
                      Load Current Member Only
                    </button>
                  </>
                )}
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  onClick={handleManualClearAllStorage}
                  title="Clear all saved data"
                >
                  Clear All Saved Data
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className='detail-booking_forma' encType="multipart/form-data">
            {/* Show only current member's form */}
            {members.map((member, index) => (
              index === currentStep && (
                <div className="card mb-4 border" key={index}>
                  <div className="card-header bg-light d-flex justify-content-between align-items-center flex-wrap">
                    <div className="mb-0 h5">
                      Member {index + 1} Details
                      {member.allocatedActivity && (
                        <span className="badge bg-info rounded-2 p-2 ms-3" style={{ position: 'inherit' }}>
                          {member.allocatedActivity}
                        </span>
                      )}
                      {completedSteps.includes(index) && (
                        <span className="ms-2 badge bg-success">Completed</span>
                      )}
                    </div>
                    <div>
                      {/* Load saved data button for current member */}
                      {id && storageDataAvailable.includes(index) && !dataLoadedFromStorage && (
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={handleLoadCurrentMemberData}
                          title="Load saved data for this member"
                        >
                          Load Saved Data
                        </button>
                      )}
                      {/* Clear saved data button */}
                      {id && (
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger me-auto"
                          onClick={handleClearSavedData}
                          title="Clear saved data for this member"
                        >
                          Clear Saved Data
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="card-body">
                    <div className="row g-3">
                      {/* Personal Details Section */}
                      <div className="col-12">
                        <div className="text-primary border-bottom pb-2 h6">Personal Information</div>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold">
                          Full Name <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className={`form-control ${getValidationClass(index, 'name')}`}
                          value={member.name}
                          onChange={(e) => handleChange(index, 'name', e.target.value)}
                          onBlur={() => handleBlur(index, 'name')}
                          placeholder="Enter full name"
                          required
                        />
                        {touched[`${index}-name`] && errors[`${index}-name`] && (
                          <div className="invalid-feedback" style={{ fontSize: '12px' }}>{errors[`${index}-name`]}</div>
                        )}
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold">
                          Contact Number <span className="text-danger">*</span>
                        </label>
                        <input
                          type="tel"
                          className={`form-control ${getValidationClass(index, 'contact')}`}
                          value={member.contact}
                          onChange={(e) => handleChange(index, 'contact', e.target.value)}
                          onBlur={() => handleBlur(index, 'contact')}
                          placeholder="10-digit mobile number"
                          maxLength="10"
                          required
                        />
                        {touched[`${index}-contact`] && errors[`${index}-contact`] && (
                          <div className="invalid-feedback" style={{ fontSize: '12px' }}>{errors[`${index}-contact`]}</div>
                        )}
                      </div>

                      <div className="col-md-4">
                        <label className="form-label fw-semibold">
                          Date of Birth <span className="text-danger">*</span>
                        </label>
                        <input
                          type="date"
                          className={`form-control ${getValidationClass(index, 'dob')}`}
                          value={member.dob}
                          onChange={(e) => handleChange(index, 'dob', e.target.value)}
                          onBlur={() => handleBlur(index, 'dob')}
                          max={new Date().toISOString().split('T')[0]}
                          required
                        />
                        {touched[`${index}-dob`] && errors[`${index}-dob`] && (
                          <div className="invalid-feedback" style={{ fontSize: '12px' }}>{errors[`${index}-dob`]}</div>
                        )}
                      </div>

                      <div className="col-md-4">
                        <label className="form-label fw-semibold">
                          Gender <span className="text-danger">*</span>
                        </label>
                        <select
                          className={`form-select ${getValidationClass(index, 'gender')}`}
                          value={member.gender}
                          onChange={(e) => handleChange(index, 'gender', e.target.value)}
                          onBlur={() => handleBlur(index, 'gender')}
                          required
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                        {touched[`${index}-gender`] && errors[`${index}-gender`] && (
                          <div className="invalid-feedback" style={{ fontSize: '12px' }}>{errors[`${index}-gender`]}</div>
                        )}
                      </div>

                      <div className="col-md-4">
                        <label className="form-label fw-semibold">
                          Email (for trip photos)
                        </label>
                        <input
                          type="email"
                          className={`form-control ${getValidationClass(index, 'email')}`}
                          value={member.email}
                          onChange={(e) => handleChange(index, 'email', e.target.value)}
                          onBlur={() => handleBlur(index, 'email')}
                          placeholder="example@email.com"
                        />
                        {touched[`${index}-email`] && errors[`${index}-email`] && (
                          <div className="invalid-feedback" style={{ fontSize: '12px' }}>{errors[`${index}-email`]}</div>
                        )}
                      </div>

                      {/* ID Proof Section */}
                      <div className="col-12 mt-3">
                        <div className="text-primary border-bottom pb-2 h6">Identity Proof</div>
                      </div>

                      <div className="col-md-4">
                        <label className="form-label fw-semibold">
                          ID Proof Type <span className="text-danger">*</span>
                        </label>
                        <select
                          className={`form-select ${getValidationClass(index, 'idProofType')}`}
                          value={member.idProofType}
                          onChange={(e) => {
                            handleChange(index, 'idProofType', e.target.value);
                            handleChange(index, 'idProofNumber', '');
                          }}
                          onBlur={() => handleBlur(index, 'idProofType')}
                          required
                        >
                          <option value="">Select ID Proof</option>
                          <option value="Aadhar Card">Aadhar Card</option>
                          <option value="Voter ID">Voter ID</option>
                          <option value="Passport">Passport</option>
                          <option value="Driving License">Driving License</option>
                        </select>
                        {touched[`${index}-idProofType`] && errors[`${index}-idProofType`] && (
                          <div className="invalid-feedback" style={{ fontSize: '12px' }}>{errors[`${index}-idProofType`]}</div>
                        )}
                      </div>

                      <div className="col-md-4">
                        <label className="form-label fw-semibold">
                          ID Proof Number <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className={`form-control ${getValidationClass(index, 'idProofNumber')}`}
                          value={member.idProofNumber}
                          onChange={(e) => handleChange(index, 'idProofNumber', e.target.value)}
                          onBlur={() => handleBlur(index, 'idProofNumber')}
                          placeholder={member.idProofType ? `Enter ${member.idProofType} number` : 'Select ID type first'}
                          disabled={!member.idProofType}
                          required
                        />
                        {touched[`${index}-idProofNumber`] && errors[`${index}-idProofNumber`] && (
                          <div className="invalid-feedback" style={{ fontSize: '12px' }}>{errors[`${index}-idProofNumber`]}</div>
                        )}
                        {member.idProofType && !errors[`${index}-idProofNumber`] && (
                          <small className="text-muted d-block mt-1" style={{ fontSize: '12px' }}>{idValidationMessages[member.idProofType]}</small>
                        )}
                      </div>

                      <div className="col-md-4">
                        <label className="form-label fw-semibold">
                          Upload ID Proof <span className="text-danger">*</span>
                        </label>
                        <input
                          type="file"
                          className={`form-control ${getValidationClass(index, 'idProofFile')}`}
                          onChange={(e) => handleChange(index, 'idProofFile', e)}
                          onBlur={() => handleBlur(index, 'idProofFile')}
                          accept=".jpg,.jpeg,.png,.pdf"
                          required={!id && !member.idProofFile} style={{ padding: '8px' }}
                        />
                        {touched[`${index}-idProofFile`] && errors[`${index}-idProofFile`] && (
                          <div className="invalid-feedback">{errors[`${index}-idProofFile`]}</div>
                        )}
                        <small className="text-muted" style={{ fontSize: '12px', lineHeight: '12px' }}>Max 5MB (JPG, PNG, PDF only)</small>
                        {id && member.idProofFile && (
                          <small className="text-success d-block" style={{ fontSize: '12px', lineHeight: '12px' }}>New file selected: {member.idProofFile.name}</small>
                        )}
                        {id && !member.idProofFile && member.hasFile && (
                          <small className="text-info d-block" style={{ fontSize: '12px', lineHeight: '12px' }}>
                            Previously uploaded file: {member.fileName || 'ID proof'} (saved locally)
                          </small>
                        )}
                      </div>

                      {/* Emergency Contact Section */}
                      <div className="col-12 mt-3">
                        <div className="text-primary border-bottom pb-2 h6">Emergency Contact</div>
                      </div>

                      <div className="col-md-4">
                        <label className="form-label fw-semibold">
                          Contact Name <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className={`form-control ${getValidationClass(index, 'emergencyName')}`}
                          value={member.emergencyName}
                          onChange={(e) => handleChange(index, 'emergencyName', e.target.value)}
                          onBlur={() => handleBlur(index, 'emergencyName')}
                          placeholder="Emergency contact name"
                          required
                        />
                        {touched[`${index}-emergencyName`] && errors[`${index}-emergencyName`] && (
                          <div className="invalid-feedback" style={{ fontSize: '12px' }}>{errors[`${index}-emergencyName`]}</div>
                        )}
                      </div>

                      <div className="col-md-4">
                        <label className="form-label fw-semibold">
                          Contact Number <span className="text-danger">*</span>
                        </label>
                        <input
                          type="tel"
                          className={`form-control ${getValidationClass(index, 'emergencyContact')}`}
                          value={member.emergencyContact}
                          onChange={(e) => handleChange(index, 'emergencyContact', e.target.value)}
                          onBlur={() => handleBlur(index, 'emergencyContact')}
                          placeholder="10-digit mobile number"
                          maxLength="10"
                          required
                        />
                        {touched[`${index}-emergencyContact`] && errors[`${index}-emergencyContact`] && (
                          <div className="invalid-feedback" style={{ fontSize: '12px' }}>{errors[`${index}-emergencyContact`]}</div>
                        )}
                      </div>

                      <div className="col-md-4">
                        <label className="form-label fw-semibold">
                          Relation <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className={`form-control ${getValidationClass(index, 'emergencyRelation')}`}
                          value={member.emergencyRelation}
                          onChange={(e) => handleChange(index, 'emergencyRelation', e.target.value)}
                          onBlur={() => handleBlur(index, 'emergencyRelation')}
                          placeholder="e.g., Father, Mother, Spouse"
                          required
                        />
                        {touched[`${index}-emergencyRelation`] && errors[`${index}-emergencyRelation`] && (
                          <div className="invalid-feedback" style={{ fontSize: '12px' }}>{errors[`${index}-emergencyRelation`]}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            ))}

            {/* Navigation Buttons */}
            <div className="d-flex justify-content-between align-items-center mt-4">
              <div>
                <button
                  type="button"
                  className="btn btn-outline-secondary me-2"
                  onClick={goToPreviousStep}
                  disabled={currentStep === 0}
                >
                  ← Previous Member
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                  Back to Top
                </button>
              </div>

              <div>
                {currentStep < members.length - 1 ? (
                  <button
                    type="button"
                    className="btn btn-primary px-4"
                    onClick={handleSaveAndContinue}
                  >
                    Save & Continue →
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="btn btn-success px-5"
                    disabled={loading || completedSteps.length !== members.length}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Submitting...
                      </>
                    ) : (
                      'Submit All Members'
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Summary of completed steps */}
            {completedSteps.length > 0 && (
              <div className="alert alert-success mt-4">
                <strong>Progress:</strong> {completedSteps.length} of {members.length} members completed.
                {completedSteps.length === members.length && (
                  <span className="ms-2">✓ All members ready for submission!</span>
                )}
              </div>
            )}
          </form>
        </div>
      </div>

      <style jsx>{`
        .step-indicator {
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .step-indicator:disabled {
          cursor: not-allowed;
          opacity: 0.6;
        }
        .step-indicator.btn-success {
          background-color: #28a745;
          border-color: #28a745;
        }
        .step-indicator.btn-warning {
          background-color: #ffc107;
          border-color: #ffc107;
          color: #000;
        }
      `}</style>
    </div>
  );
}

export const dynamic = 'force-static';

export default function BookingForm() {
  return (
    <Suspense fallback={<div>Loading booking form...</div>}>
      <BookingFormInner />
    </Suspense>
  );
}
