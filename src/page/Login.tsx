import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { login, loginAdmin } from "../services/api";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Loading } from "@/utils/Loading";
import { Modal } from "@/utils/Modals";

function LoginPage() {
  const [changeForm, setChangeForm] = useState('welcome');
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [ready, setReady] = useState(false);
  const [showFailModal, setShowFailModal] = useState(false);
  const [showDennyModal, setShowDennyModal] = useState(false);

  const navigate = useNavigate();

  async function handleLoginAdmin(e: any) {
    e.preventDefault();
    if (ready) return; // ✅ cegah double-fire
    try {
      const getStatus = await loginAdmin(userName, password, true);
      const token = localStorage.getItem("token");
      if (getStatus === 200) {
        setReady(true);
        setTimeout(() => {
          navigate(`/dashboard/${token}`);
        }, 3000);
      } else if (getStatus === 401) {
        setReady(false);
        setShowFailModal(true);
      } else {
        setShowFailModal(true);
      }
    } catch (error) {
      setShowFailModal(true);
      setReady(false);
    }
  }

  async function handleLogin(e: any) {
    e.preventDefault();
    if (ready) return; // ✅ cegah double-fire
    try {
      const result = await login(userName, password);
      if (result.status === 200) {
        const token = localStorage.getItem("token");
        setReady(true);
        setTimeout(() => navigate(`/anggota/${token}`, { state: { nkp: userName } }), 3000);
      } else {
        setShowFailModal(true);
      }
    } catch (error) {
      setShowFailModal(true);
    }
  }

  // ✅ satu-satunya perubahan struktural: submit form disesuaikan dgn form yang aktif
  const activeSubmit = changeForm === 'admin' ? handleLoginAdmin : handleLogin;

  function handleButton(e: string) {
    if (e === 'welcome') {
      setPassword("");
      setUserName("");
      setChangeForm(e);
    } else {
      setChangeForm(e);
    }
  }

  if (ready === true) return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        background: "#c1d2df",
        backdropFilter: "blur(3px)",
        WebkitBackdropFilter: "blur(3px)",
      }}
    >
      <Loading />
    </div>
  );

  return (
    <div className="min-h-screen flex bg-[#bcd1e1]">
      <div className="flex items-center justify-center w-full lg:w-[100%]">
        <form onSubmit={activeSubmit}>
          {changeForm === 'welcome' ? (
            <Card
              className="w-80 rounded-2xl relative overflow-hidden"
              style={{
                background: "#ffffff",
                border: "0.5px solid rgba(46,97,147,0.15)",
                boxShadow: "0 24px 60px rgba(0,0,0,0.3)",
              }}
            >
              <div className="absolute w-[200px] h-[200px] -top-[80px] -right-[80px] rounded-full border border-slate-200/70 pointer-events-none z-0" />
              <div className="absolute w-[320px] h-[320px] -top-[125px] -right-[95px] rounded-full border border-slate-200/70 pointer-events-none z-0" />

              <CardHeader className="text-center pb-2 pt-8 px-8 relative z-10">
                <div className="mx-auto mb-4 flex items-center justify-center rounded-xl">
                  <img
                    src="/Logo_ordo.jpeg"
                    alt="Logo Ordo"
                    style={{ width: "75px", height: "75px", objectFit: "contain" }}
                  />
                </div>
                <CardTitle className="text-xl font-semibold" style={{ color: "#122C45" }}>
                  Selamat Datang
                </CardTitle>
                <p className="text-sm mt-1" style={{ color: "#6b7f93" }}>
                  Pilih peran untuk melanjutkan
                </p>
                <div
                  className="mx-auto mt-3"
                  style={{ width: "32px", height: "2px", background: "#2E6193", borderRadius: "2px", opacity: 0.5 }}
                />
              </CardHeader>

              <CardContent className="px-8 pb-5 pt-3.5 space-y-3 relative z-10">
                <Button
                  type="button"
                  onClick={() => handleButton('admin')}
                  className="w-full h-12 rounded-xl text-sm font-medium flex items-center gap-2.5 transition-all"
                  style={{ background: "#122C45", color: "#ffffff", border: "none" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#0d2035")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#122C45")}
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  Admin
                </Button>

                <Button
                  type="button"
                  onClick={() => handleButton('angota')}
                  className="w-full h-12 rounded-xl text-sm font-medium flex items-center gap-2.5 transition-all"
                  style={{ background: "#2E6193", color: "#ffffff", border: "none" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#255280")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#2E6193")}
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  Anggota Provinsi
                </Button>
              </CardContent>
            </Card>
          ) : changeForm === 'admin' ? (
            <Card
              className="w-80 rounded-2xl relative overflow-hidden"
              style={{
                background: "#ffffff",
                border: "0.5px solid rgba(46,97,147,0.15)",
                boxShadow: "0 24px 60px rgba(0,0,0,0.3)",
              }}
            >
              <div className="absolute w-[200px] h-[200px] -top-[80px] -right-[80px] rounded-full border border-slate-200/70 pointer-events-none z-0" />
              <div className="absolute w-[320px] h-[320px] -top-[125px] -right-[95px] rounded-full border border-slate-200/70 pointer-events-none z-0" />

              <CardContent className="px-8 pb-5 pt-3.5 space-y-3 relative z-10">
                <Field>
                  <FieldLabel htmlFor="input-field-username" style={{ color: '#122C45' }}>Username</FieldLabel>
                  <Input
                    onChange={(e) => setUserName(e.target.value)}
                    value={userName}
                    autoComplete="off"
                    onWheel={(e) => e.currentTarget.blur()}
                    id="input-field-username"
                    type="number"
                    className="no-spinner"
                    placeholder="Enter your username"
                  />
                </Field>

                <Field className="pb-5">
                  <FieldLabel htmlFor="input-field-password" style={{ color: '#122C45' }}>Password</FieldLabel>
                  <div className="relative">
                    <Input
                      onChange={(e) => setPassword(e.target.value)}
                      value={password}
                      autoComplete="off"
                      id="input-field-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                    </button>
                  </div>
                </Field>

                {/* ✅ onClick DIHAPUS — cukup type="submit", form yang urus */}
                <Button
                  type="submit"
                  className="w-full h-12 rounded-xl text-sm font-medium flex items-center gap-2.5 transition-all"
                  style={{ background: "#122C45", color: "#ffffff", border: "none" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#0d2035")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#122C45")}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="8" cy="10" r="6"></circle>
                    <circle cx="8" cy="10" r="2" fill="#122C45"></circle>
                    <path d="M12 10 L22 20 L20 22 L18 20 L16 22 L14 20 L16 18 L10 12 Z"></path>
                  </svg>
                  Login
                </Button>

                <Button
                  type="button"
                  onClick={() => handleButton('welcome')}
                  className="w-full h-12 rounded-xl text-sm font-medium flex items-center gap-2.5 transition-all"
                  style={{ background: "#ffffff", color: "#2E6193", border: "2px solid #2E6193" }}
                  onMouseEnter={(e) => ((e.currentTarget.style.background = "#255280"), (e.currentTarget.style.color = "#ffffff"))}
                  onMouseLeave={(e) => ((e.currentTarget.style.background = "#ffffff"), (e.currentTarget.style.color = "#255280"))}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12H5"></path>
                    <path d="M12 19l-7-7 7-7"></path>
                  </svg>
                  Back
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card
              className="w-80 rounded-2xl relative overflow-hidden"
              style={{
                background: "#ffffff",
                border: "0.5px solid rgba(46,97,147,0.15)",
                boxShadow: "0 24px 60px rgba(0,0,0,0.3)",
              }}
            >
              <div className="absolute w-[200px] h-[200px] -top-[80px] -right-[80px] rounded-full border border-slate-200/70 pointer-events-none z-0" />
              <div className="absolute w-[320px] h-[320px] -top-[125px] -right-[95px] rounded-full border border-slate-200/70 pointer-events-none z-0" />

              <CardContent className="px-8 pb-5 pt-3.5 space-y-3 relative z-10">
                <Field>
                  <FieldLabel htmlFor="input-field-username" style={{ color: '#122C45' }}>Username</FieldLabel>
                  <Input
                    onChange={(e) => setUserName(e.target.value)}
                    value={userName}
                    autoComplete="off"
                    onWheel={(e) => e.currentTarget.blur()}
                    id="input-field-username"
                    type="number"
                    className="no-spinner"
                    placeholder="Enter your username"
                  />
                </Field>

                <Field className="pb-5">
                  <FieldLabel htmlFor="input-field-username" style={{ color: '#122C45' }}>Password</FieldLabel>
                  <div className="relative">
                    <Input
                      onChange={(e) => setPassword(e.target.value)}
                      value={password}
                      id="input-field-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                    </button>
                  </div>
                </Field>

                {/* ✅ onClick DIHAPUS — cukup type="submit" */}
                <Button
                  type="submit"
                  className="w-full h-12 rounded-xl text-sm font-medium flex items-center gap-2.5 transition-all"
                  style={{ background: "#2E6193", color: "#ffffff", border: "none" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#2a5785")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#2E6193")}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="8" cy="10" r="6"></circle>
                    <circle cx="8" cy="10" r="2" fill="#122C45"></circle>
                    <path d="M12 10 L22 20 L20 22 L18 20 L16 22 L14 20 L16 18 L10 12 Z"></path>
                  </svg>
                  Login
                </Button>

                {/* ✅ type="button" ditambahkan — sebelumnya hilang, bisa ikut submit form */}
                <Button
                  type="button"
                  onClick={() => handleButton('welcome')}
                  className="w-full h-12 rounded-xl text-sm font-medium flex items-center gap-2.5 transition-all"
                  style={{ background: "#ffffff", color: "#2E6193", border: "2px solid #2E6193" }}
                  onMouseEnter={(e) => ((e.currentTarget.style.background = "#255280"), (e.currentTarget.style.color = "#ffffff"))}
                  onMouseLeave={(e) => ((e.currentTarget.style.background = "#ffffff"), (e.currentTarget.style.color = "#255280"))}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12H5"></path>
                    <path d="M12 19l-7-7 7-7"></path>
                  </svg>
                  Back
                </Button>
              </CardContent>
            </Card>
          )}
        </form>
      </div>

      <Modal
        title="Login Failed"
        description="Please check your username or password, or simply contact the admin if you encounter any issues."
        open={showFailModal}
        onClose={() => setShowFailModal(false)}
        onConfirm={() => setShowFailModal(false)}
      />

      <Modal
        title="Login Failed"
        description="Access Denied. You do not have admin privileges."
        open={showDennyModal}
        onClose={() => setShowDennyModal(false)}
        onConfirm={() => setShowDennyModal(false)}
      />
    </div>
  );
}

export default LoginPage;