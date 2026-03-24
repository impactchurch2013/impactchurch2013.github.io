export const INVITE_ADMIN_ONLY_MESSAGE = "Only church admins can invite members.";
export const INVITE_EMAIL_REQUIRED_MESSAGE = "Please enter an email address.";
export const INVITE_EMAIL_INVALID_MESSAGE = "Please enter a valid email address.";
export const INVITE_ALLOWLIST_WRITE_FAILED_MESSAGE = "Could not add this email to the allowlist. Check the console and your Firestore rules.";

export const ADMIN_EMAIL_TO_REQUIRED_MESSAGE = "Please enter the recipient email address.";

export const APPROVE_ADMIN_ONLY_MESSAGE = "Only church admins can approve changes.";
export const APPROVE_CONFIRM_MESSAGE = "Approve this change? The directory will update for everyone.";
export const PENDING_CHANGE_MISSING_MESSAGE = "This pending change is no longer in Firestore.";
export const APPROVE_MISSING_MEMBER_REFERENCE_MESSAGE = "This entry is missing a member reference and is not marked as onboarding. It cannot be approved automatically.";
export const APPROVE_SUCCESS_MESSAGE = "Approved. The directory has been updated.";
export const APPROVE_FAILED_MESSAGE = "Could not approve this change. Check the console for details.";

export const DENY_ADMIN_ONLY_MESSAGE = "Only church admins can deny changes.";
export const DENY_CONFIRM_MESSAGE = "Deny this request? It will be removed from the queue.";
export const DENY_SUCCESS_MESSAGE = "Request denied and removed from the queue.";
export const DENY_FAILED_MESSAGE = "Could not deny this change. Check the console for details.";
