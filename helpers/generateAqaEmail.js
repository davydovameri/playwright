export function generateAqaEmail(baseEmail) {
    const timestamp = Date.now();
    const [localPart, domain] = baseEmail.split('@');
    return `aqa-${localPart}-${timestamp}@${domain}`;
}