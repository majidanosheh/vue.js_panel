// src/utils/jwt.js

export function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Error parsing JWT:', e);
    return null;
  }
}

export function extractPermissions(token) {
  const payload = parseJwt(token);
  if (!payload) return { roles: [], permissions: [] };

  // استخراج نقش‌ها (معمولا در کلید role یا http://schemas.microsoft.com/ws/2008/06/identity/claims/role)
  let roles = payload.role || payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || [];
  if (!Array.isArray(roles)) roles = [roles]; // اگر یک نقش باشد، تبدیل به آرایه کن

  // استخراج دسترسی‌ها (معمولا در کلید Permission)
  let permissions = payload.Permission || payload.permission || [];
  if (!Array.isArray(permissions)) permissions = [permissions];

  return { roles, permissions };
}