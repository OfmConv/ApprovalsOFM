import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_BASE_URL
export const axiosInstance = axios.create({
  baseURL: BASE_URL,

});

const PUBLIC_ENDPOINTS = [
  "/login",
  "/admin/login",
  "/refreshToken",
  "/checkEmail",
  "/checkNKP",
];

function isPublicEndpoint(url?: string) {
  if (!url) return false;
  return PUBLIC_ENDPOINTS.some((endpoint) => url.includes(endpoint));
}

axiosInstance.interceptors.request.use(
  (config) => {
    if (isPublicEndpoint(config.url)) {
      return config;
    }
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (isPublicEndpoint(originalRequest?.url)) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const rToken = localStorage.getItem("RToken");
        if (!rToken) {
          window.location.href = "/login";
          return Promise.reject(error);
        }

        const res = await axios.post(`${BASE_URL}/api/v1/refreshToken`, {
          refresh_token: rToken,
        });

        localStorage.setItem("token", res.data.access_token);
        originalRequest.headers.Authorization = `Bearer ${res.data.access_token}`;

        return axiosInstance(originalRequest);
      } catch (err) {
        localStorage.removeItem("token");
        localStorage.removeItem("RToken");
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export async function GetUsers() {
  try {
    const res = await axiosInstance.get("/users");
    console.log(res);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getToken() {
  const tokens = await localStorage.getItem("token");
  return tokens;
}

export async function refreshTokens() {
  try {
    const rToken = localStorage.getItem("RToken");
    if (!rToken) {
      throw new Error("No refresh token available");
    }

    const res = await axios.post(`${BASE_URL}/refreshToken`, {
      refresh_token: rToken,
    });

    localStorage.setItem("token", res.data.access_token);
    return res.data;
  } catch (error) {
    localStorage.removeItem("token");
    localStorage.removeItem("RToken");
    window.location.href = "/login";
    throw error;
  }
}

export async function createAccount(body: any) {
  try {
    const res = await axiosInstance.post("/register", body);
    console.log(res);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function verifyEmail(emails: any) {
  try {
    const res = await axiosInstance.post("/checkEmail", {
      email: emails,
    });
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function verifyNKP(nkp: any) {
  try {
    const res = await axiosInstance.post("/checkNKP", {
      nkp: nkp,
    });
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function login(nkp: string, secret: string) {
  try {
    const res = await axiosInstance.post("/login", {
      nkp,
      secret,
    });

    console.log("Response:", res.data);

    if (res.status === 200) {
      try {
        localStorage.setItem("token", res.data.data.access_token);
        localStorage.setItem("RToken", res.data.data.refresh_token);

        return { status: 200, success: true };
      } catch (storageError) {
        return { status: 500, success: false, error: "Failed to save token" };
      }
    } else {
      return {
        status: 401,
        success: false,
        error: res.data?.message || "Invalid credentials",
      };
    }
  } catch (error: any) {
    console.error("Login error:", error.response?.data || error.message);
    return {
      status: error.response?.status || 500,
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
}

export async function loginAdmin(nkp: string, secret: string, adminAcc: boolean) {
  try {
    const res = await axiosInstance.post("/admin/login", {
      nkp,
      secret,
      is_admin: adminAcc,
    });

    if (res.status === 200 && res.data?.data?.access_token) {
      localStorage.setItem("token", res.data.data.access_token);
      localStorage.setItem("RToken", res.data.data.refresh_token);
      localStorage.setItem("nkp", res.data.data.nkp);
      return 200;
    } else {
      return 401;
    }
  } catch (error: any) {
    return error?.response?.status ?? 500;
  }
}

export async function getProfile(type: string, nkp?: string) {
  try {
    const params = new URLSearchParams({ type });
    if (nkp) params.append("nkp", nkp);

    const res = await axiosInstance.get(`/getProfile?${params.toString()}`);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getPendingData() {
  try {
    const res = await axiosInstance.get("/approvals/pending");
    return res.data.data;
  } catch (error) {
    return error;
  }
}

export async function changePassword(nkp: string, newPas: any) {
  try {
    const res = await axiosInstance.patch("/admin/changePassword", {
      nkp: nkp,
      new_password: newPas,
    });
    console.log(res);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function changeAdminAcc(currentNKP: string, newNKP: string) {
  try {
    const res = await axiosInstance.post("/admin/switch", {
      current_nkp: currentNKP,
      new_nkp: newNKP,
    });
    console.log(res);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function requestChange(
  nkp: string,
  description: string,
  detailUser: Record<string, any>,
  email?: string
) {
  try {
    const res = await axiosInstance.post("/request-change", {
      nkp,
      description,
      email,
      detail_user: detailUser,
    });
    console.log("SUCCESS:", res.data);
    return res.data;
  } catch (error) {
    console.log("MASUK CATCH?", error);
    throw error;
  }
}

export async function getEducation(nkp: string) {
  const res = await axiosInstance.get("/getEducation", { params: { nkp } });
  return res.data.data;
}

export async function requestEducationChange(
  nkp: string,
  description: string,
  action: "insert" | "update" | "delete",
  education: { level: string; institution: string; start_year: number; end_year: number },
  targetId?: number
) {
  const res = await axiosInstance.post("/education/request-change", {
    nkp,
    description,
    action,
    target_id: targetId,
    education,
  });
  return res.data;
}

export async function approve(id: number) {
  try {
    const res = await axiosInstance.patch("/approvals/approve", {
      approval_id: id,
    });
    console.log(res);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function reject(id: number) {
  try {
    const res = await axiosInstance.post("/approvals/reject", {
      approval_id: id,
    });
    console.log(res);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getReligiousFeast(nkp: string) {
  const res = await axiosInstance.get("/getReligiousFeast", { params: { nkp } });
  return res.data.data;
}

export async function requestReligiousFeastChange(
  nkp: string,
  description: string,
  action: "insert" | "update" | "delete",
  religiousFeast: { formation_type: string; formation_date: string; location: string; notes: string },
  targetId?: number
) {
  const res = await axiosInstance.post("/religious-feast/request-change", {
    nkp,
    description,
    action,
    target_id: targetId,
    religious_feast: religiousFeast,
  });
  return res.data;
}

export async function getAssignment(nkp: string) {
  const res = await axiosInstance.get("/getAssignment", { params: { nkp } });
  return res.data.data;
}

export async function requestAssignmentChange(
  nkp: string,
  description: string,
  action: "insert" | "update" | "delete",
  assignment: { location: string; tugas: string; date: string },
  targetId?: number
) {
  const res = await axiosInstance.post("/assignment/request-change", {
    nkp,
    description,
    action,
    target_id: targetId,
    assignment,
  });
  return res.data;
}

export async function GetDewanPimpinan() {
  const res = await axiosInstance.get("/dewan-pimpinan")
  return res;
}

export async function getAllWilayah() {
  try {
    const res = await axiosInstance.get("/wilayah");
    return res.data.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function createWilayah(body: {
  nama_lokasi: string;
  status: string;
  kota: string;
  provinsi: string;
  negara?: string;
  pemimpin: string;
  jabatan: string;
  periode_mulai?: string;
  periode_selesai?: string;
  fungsi_khusus?: string;
}) {
  try {
    const res = await axiosInstance.post("/wilayah", body);
    console.log(res);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteWilayah(id: number) {
  try {
    const res = await axiosInstance.delete(`/wilayah/${id}`);
    console.log(res);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getAllMinisterProvinsial() {
  try {
    const res = await axiosInstance.get("/minister-provinsial");
    console.log(res);
    return res.data.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function createMinisterProvinsial(body: {
  nama: string;
  periode_mulai?: string;
  periode_selesai?: string;
  keterangan?: string;
  urutan?: number;
}) {
  try {
    const res = await axiosInstance.post("/minister-provinsial", body);
    console.log(res);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function updateMinisterProvinsial(
  id: number,
  body: Partial<{
    nama: string;
    periode_mulai: string;
    periode_selesai: string;
    keterangan: string;
    urutan: number;
  }>
) {
  try {
    const res = await axiosInstance.patch(`/minister-provinsial/${id}`, body);
    console.log(res);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteMinisterProvinsial(id: number) {
  try {
    const res = await axiosInstance.delete(`/minister-provinsial/${id}`);
    console.log(res);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteUser(nkp: string) {
  try {
    const res = await axiosInstance.delete(`/admin/user/${nkp}`);
    console.log(res);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function updateProfileDirect(
  nkp: string,
  detailUser: Record<string, any>,
  email?: string
) {
  try {
    const res = await axiosInstance.patch("/admin/updateProfile", {
      nkp,
      email,
      detail_user: detailUser,
    });
    console.log(res);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function updateEducationDirect(
  nkp: string,
  action: "insert" | "update" | "delete",
  education: { level: string; institution: string; start_year: number; end_year: number },
  targetId?: number
) {
  const res = await axiosInstance.patch("/admin/education/update-direct", {
    nkp,
    action,
    target_id: targetId,
    education,
  });
  return res.data;
}

export async function updateReligiousFeastDirect(
  nkp: string,
  action: "insert" | "update" | "delete",
  religiousFeast: { formation_type: string; formation_date: string; location: string; notes: string },
  targetId?: number
) {
  const res = await axiosInstance.patch("/admin/religious-feast/update-direct", {
    nkp,
    action,
    target_id: targetId,
    religious_feast: religiousFeast,
  });
  return res.data;
}

export async function updateAssignmentDirect(
  nkp: string,
  action: "insert" | "update" | "delete",
  assignment: { location: string; tugas: string; date: string },
  targetId?: number
) {
  const res = await axiosInstance.patch("/admin/assignment/update-direct", {
    nkp,
    action,
    target_id: targetId,
    assignment,
  });
  return res.data;
}

export async function getGalleryPhotos(nkp: string) {
  const res = await axiosInstance.get("/getGalleryPhotos", { params: { nkp } });
  return res.data.data;
}

export async function requestGalleryPhotoChange(
  nkp: string,
  description: string,
  action: "insert" | "update" | "delete",
  photo: { file_path: string; title: string; description: string },
  targetId?: number
) {
  const res = await axiosInstance.post("/gallery-photo/request-change", {
    nkp,
    description,
    action,
    target_id: targetId,
    gallery_photo: photo,
  });
  return res.data;
}

export async function updateGalleryPhotoDirect(
  nkp: string,
  action: "insert" | "update" | "delete",
  photo: { file_path: string; title: string; description: string },
  targetId?: number
) {
  const res = await axiosInstance.patch("/admin/gallery-photo/update-direct", {
    nkp,
    action,
    target_id: targetId,
    gallery_photo: photo,
  });
  return res.data;
}