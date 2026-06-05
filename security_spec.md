# Security Specification: Fast & Safe Construction App

## 1. Data Invariants
- **Consultation Integrity**: A consultation requests must have exactly the required fields. They can only be created with `status == 'pending'`.
- **Temporal Honesty**: The `createdAt` timestamp must be strictly synchronized to the server time `request.time`.
- **PII Lockdown**: Client submissions contain contact details (Email, Phone). `read`, `list`, `update`, and `delete` operations are strictly blocked from the public SDK to ensure complete PII privacy.
- **Poisoning Prevention**: The dynamic Firestore `{consultationId}` path parameter must conform to a strict regular expression format (`isValidId`) and length bounds under 128 chars.

## 2. The "Dirty Dozen" Malicious Payloads
The following payloads should be evaluated and strictly return `PERMISSION_DENIED` during a write:

1. **Spoofed Created-At**: Setting `createdAt` to a client-controlled past or future date.
2. **Pre-completed Lead**: Setting `status` to `'completed'` or `'contacted'` during creation.
3. **Shadow Field Injection**: Injecting a hidden field such as `isAdmin: true` or `isApproved: true`.
4. **Invalid Collection ID (Junk characters)**: Specifying a document ID of 1KB with control/escape chars.
5. **Blanket Read Request**: Trying to fetch all consultations.
6. **Malicious Delete**: Trying to delete a consultation.
7. **Cross-site Document Update**: Attempting to overwrite/update a contact message once submitted.
8. **Oversized String Payload**: Submitting a name or message over 10KB (Wallet Denial).
9. **Missing Mandatory Fields**: Submitting without the contact phone number.
10. **Type Mismatch Payload**: Submitting the `phone` field as an array/boolean rather than a string.
11. **Excessive Key Count**: Submitting extra properties not defined in the specification.
12. **Empty Identifiers**: Submitting empty string fields that bypass length validation checks.
