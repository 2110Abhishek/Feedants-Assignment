/**
 * Computes the lifecycle state of a competition based on UTC timestamps and manual status overrides.
 */
const calculateLifecycle = (competition, referenceTime = new Date()) => {
  if (!competition) return 'UNKNOWN';

  if (competition.status === 'DRAFT') {
    return 'DRAFT';
  }

  if (competition.status === 'COMPLETED') {
    return 'COMPLETED';
  }

  const now = referenceTime.getTime();
  const regStart = new Date(competition.registrationStartAt).getTime();
  const regEnd = new Date(competition.registrationEndAt).getTime();
  const subStart = new Date(competition.submissionStartAt).getTime();
  const subEnd = new Date(competition.submissionEndAt).getTime();
  const resultDate = competition.resultDate ? new Date(competition.resultDate).getTime() : subEnd;

  if (now < regStart) {
    return 'UPCOMING';
  }

  if (now >= regStart && now < regEnd) {
    return 'REGISTRATION_OPEN';
  }

  // If between registrationEnd and submissionStart
  if (now >= regEnd && now < subStart) {
    return 'REGISTRATION_CLOSED';
  }

  // Submission window
  if (now >= subStart && now < subEnd) {
    return 'SUBMISSION_OPEN';
  }

  // After submission ends, before results
  if (now >= subEnd && now < resultDate) {
    return 'JUDGING';
  }

  // After result date
  if (now >= resultDate) {
    return 'RESULTS_PUBLISHED';
  }

  return 'REGISTRATION_CLOSED';
};

/**
 * Derives user CTA state according to PRD section 77
 */
const getCompetitionAction = ({ lifecycle, isRegistered, spotsRemaining, submissionStatus }) => {
  if (lifecycle === 'UPCOMING') {
    return { action: 'UPCOMING', label: 'Registration Opens Soon', enabled: false };
  }

  if (lifecycle === 'REGISTRATION_OPEN') {
    if (!isRegistered) {
      if (spotsRemaining <= 0) {
        return { action: 'FULL', label: 'Competition Full', enabled: false };
      }
      return { action: 'REGISTER', label: 'Register Now', enabled: true };
    }
    return { action: 'REGISTERED', label: 'Registered', subLabel: 'Registration Confirmed', enabled: false };
  }

  if (lifecycle === 'REGISTRATION_CLOSED') {
    if (isRegistered) {
      return { action: 'WAITING_SUBMISSION', label: 'Registered', subLabel: 'Submission Starts Soon', enabled: false };
    }
    return { action: 'REGISTRATION_CLOSED', label: 'Registration Closed', enabled: false };
  }

  if (lifecycle === 'SUBMISSION_OPEN') {
    if (isRegistered) {
      if (submissionStatus === 'SUBMITTED' || submissionStatus === 'EVALUATED') {
        return { action: 'SUBMITTED', label: 'Submission Uploaded', enabled: false };
      }
      return { action: 'SUBMIT', label: 'Upload Submission', subLabel: 'Registered', enabled: true };
    }
    return { action: 'REGISTRATION_CLOSED', label: 'Registration Closed', enabled: false };
  }

  if (lifecycle === 'SUBMISSION_CLOSED') {
    return { action: 'SUBMISSION_CLOSED', label: 'Submission Closed', enabled: false };
  }

  if (lifecycle === 'JUDGING') {
    return { action: 'JUDGING', label: 'Judging in Progress', enabled: false };
  }

  if (lifecycle === 'RESULTS_PUBLISHED' || lifecycle === 'COMPLETED') {
    return { action: 'RESULTS', label: 'View Results', enabled: true };
  }

  return { action: 'DISABLED', label: 'Not Available', enabled: false };
};

module.exports = {
  calculateLifecycle,
  getCompetitionAction,
};
