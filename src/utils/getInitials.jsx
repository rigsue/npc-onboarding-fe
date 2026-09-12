// const getInitials = (name) => {
export function getInitials(name) {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    
    if (parts.length === 0) {
        return "";
    }
    return (
        parts[0][0] +
        (parts[1] ? parts[1][0] : "")
    ).toUpperCase();
}

// export default getInitials;