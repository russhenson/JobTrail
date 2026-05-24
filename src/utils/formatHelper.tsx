// Format Examples: firstName -> First name | first_name -> First name
export const formatName = (name: string) => {
    if (!name) return '';

    // Take the last segment after the dot
    const cleanName = name.includes('.') ? name.split('.').pop() : name;

    if (!cleanName) return name || '';

    // Handle underscore case
    if (cleanName.includes('_')) {
        return cleanName
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    }

    // Handle camelCase
    if (/([a-z])([A-Z])/g.test(cleanName)) {
        return cleanName
            .replace(/([a-z])([A-Z])/g, '$1 $2')
            .replace(/([A-Z])/g, match => match.toLowerCase())
            .replace(/^./, match => match.toUpperCase());
    }

    // Handle small letters
    return cleanName.charAt(0).toUpperCase() + cleanName.slice(1).toLowerCase();
};
