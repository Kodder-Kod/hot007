"use client"

import React, { useState } from 'react';
import { db } from "../../../../config";
import { ref, push } from 'firebase/database';
import { createUserWithEmailAndPassword, sendEmailVerification, getAuth } from 'firebase/auth';
import { FaBuilding, FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md"
import { GiPadlock, GiDialPadlock } from "react-icons/gi";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { FaPhoneAlt } from "react-icons/fa";
import { useRouter } from 'next/navigation';
import { useUserAccountName, useUserEmail, useUserID, useUserName, useUserPhone, useUserRole } from '../../../componets/zustand/profile';
import Link from 'next/link';
import { useUserTheme } from '@/app/componets/zustand/theme';

const Register = () => {
  const auth = getAuth();
  const router = useRouter();

  const [adminName, setAdminName] = useState('');
  const [adminRealName, setAdminRealName] = useState('');
  const [adminPhone, setAdminPhone] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [confirmpass, setConfirmpass] = useState('');
  const [errorMessage, setErrorMessage] = useState("");

  const theme = useUserTheme((state) => state.userTheme);

  const [showPassword, setShowPassword] = useState(false);

  const registerUser = async () => {
    if (!adminName || !adminRealName || !adminPhone || !adminEmail || !adminPassword || !confirmpass) {
      setErrorMessage("All fields are required!");
      return;
    }
    if (adminPassword.length < 6) {
      setErrorMessage("Password must be at least 6 characters!");
      return;
    }
    if (adminPassword !== confirmpass) {
      setErrorMessage("Passwords do not match!");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
      const user = userCredential.user;

      try {
        await sendEmailVerification(user, {
          handleCodeInApp: true,
          url: "https://chisendposproduction007.firebaseapp.com",
        });
      } catch (err) {
        console.log("Verification email error:", err);
      }

      const dbRef = ref(db, `web/pos/`);
      const newAdminRef = await push(dbRef, {
        Name: adminName,
        Phone: adminPhone,
        Email: adminEmail,
      });

      const userAccountId = newAdminRef.key;

      useUserID.setState({ userID: userAccountId });
      useUserEmail.setState({ userEmail: adminEmail });
      useUserPhone.setState({ userPhone: adminPhone });
      useUserName.setState({ userName: adminName });
      useUserAccountName.setState({ userAccountName: adminRealName });
      useUserRole.setState({ userRole: 'Admin' });

      const newbranchRef1 = push(ref(db, `user/accounts/`), {
        Email: adminEmail,
        Id: userAccountId,
        Phone: adminPhone,
        Name: adminName,
        UserName: adminRealName,
        Password: adminPassword,
        Role: "Admin",
        CreatedAt: Date.now(),
      });

      const newCreditKey1 = newbranchRef1.key;
      const dbRef2 = ref(db, `web/pos/${userAccountId}/employees`);
      const newbranchRef = push(dbRef2, {

        Name: adminRealName,
        Phone: adminPhone,
        Email: adminEmail,
        AccountId: newCreditKey1,
        Role: "Admin",
        CreatedAt: Date.now(),

      });

      setErrorMessage("");
      router.push('/');

      setAdminName('');
      setAdminRealName('');
      setAdminPhone('');
      setAdminEmail('');
      setAdminPassword('');
      setConfirmpass('');

    } catch (error) {
      console.log("Registration error:", error.message);
      if (error.message.includes("email-already")) {
        setErrorMessage("Email already exists!");
      } else {
        setErrorMessage("Registration failed. Try again.");
      }
    }
  };

  return (
  <div className={`relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 overflow-hidden transition-colors duration-500
${theme === "Dark" ? "bg-[#0f1026]" : "bg-gray-100"}`}>

    {/* --- BACKGROUND DECORATION --- */}
    <div className={`absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] opacity-20 
${theme === "Dark" ? "bg-blue-600" : "bg-blue-400"}`}></div>

    <div className={`absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full blur-[100px] opacity-20 
${theme === "Dark" ? "bg-indigo-800" : "bg-blue-300"}`}></div>

    {/* --- MAIN CARD --- */}
    <div className={`relative z-10 shadow-2xl rounded-[2.5rem] p-5 sm:p-7 md:p-8 max-w-lg w-full overflow-hidden backdrop-blur-sm
${theme === "Dark"
            ? "bg-gradient-to-b from-[#132962]/95 to-[#0f1026]/98 border border-white/10"
            : "bg-white/90 border border-gray-200"}`}>

        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl"></div>

        {/* Header */}
        <div className="flex items-center gap-3 sm:gap-5 mb-6 sm:mb-8">
            <div className="shrink-0 relative">
                <div className="absolute inset-0 bg-blue-500 blur-md opacity-20"></div>
                <img src="/logo.png" alt="Logo" className="relative h-10 sm:h-12 w-auto shadow-xl rounded-2xl" />
            </div>

            <div className={`h-8 sm:h-10 w-[2px] rounded-full ${theme === "Dark" ? "bg-white/10" : "bg-blue-700/20"}`}></div>

            <div>
                <h1 className={`text-xs sm:text-sm md:text-lg font-black leading-tight uppercase tracking-[0.1em] ${theme === "Dark" ? "text-white" : "text-blue-700"}`}>
                    Hotel<br />
                    <span className="text-blue-500">Management System</span>
                </h1>
            </div>
        </div>

        {/* Title */}
        <div className="mb-5 sm:mb-6">
            <h2 className={`text-lg sm:text-xl md:text-2xl font-bold tracking-tight ${theme === "Dark" ? "text-white" : "text-gray-900"}`}>
                Create Business Account
            </h2>
            <p className={`text-xs mt-2 font-medium ${theme === "Dark" ? "text-gray-400" : "text-gray-500"}`}>
                Register your business to start managing your property.
            </p>
        </div>

        {/* Error */}
        {errorMessage && (
            <div className="mb-4 sm:mb-6 p-3 bg-red-500/10 text-red-500 border-l-4 border-red-500 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">
                {errorMessage}
            </div>
        )}

        {/* FORM */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">

            {/* INPUT TEMPLATE STYLE APPLIED BELOW */}

            {/* Company */}
            <div className="group">
                <label className="block text-[10px] sm:text-xs uppercase tracking-widest font-black mb-1 opacity-50 ml-1">Company</label>
                <div className="relative">
                    <input type="text" placeholder="Hotel Name"
                        className={`w-full bg-transparent p-2.5 sm:p-3 pl-9 sm:pl-10 rounded-xl border-b-2 text-xs sm:text-sm transition-all duration-500 outline-none
${theme === "Dark" ? "border-white/10 focus:border-blue-500 bg-white/5" : "border-black/5 focus:border-blue-700 bg-gray-50"}`}
                        style={{ color: theme === "Dark" ? "#FFFFFF" : "#000000" }}
                        value={adminName}
                        onChange={(e) => setAdminName(e.target.value)}
                    />
                    <FaBuilding className={`absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-sm sm:text-lg group-focus-within:text-blue-500
${theme === "Dark" ? "text-white/20" : "text-blue-600/40"}`} />
                </div>
            </div>

            {/* Phone */}
            <div className="group">
                <label className="block text-[10px] sm:text-xs uppercase tracking-widest font-black mb-1 opacity-50 ml-1">Phone</label>
                <div className="relative">
                    <input type="text" placeholder="Enter Phone Number"
                        className={`w-full bg-transparent p-2.5 sm:p-3 pl-9 sm:pl-10 rounded-xl border-b-2 text-xs sm:text-sm outline-none
${theme === "Dark" ? "border-white/10 focus:border-blue-500 bg-white/5" : "border-black/5 focus:border-blue-700 bg-gray-50"}`}
                        style={{ color: theme === "Dark" ? "#FFFFFF" : "#000000" }}
                        value={adminPhone}
                        onChange={(e) => setAdminPhone(e.target.value)}
                    />
                    <FaPhoneAlt className={`absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-sm sm:text-lg group-focus-within:text-blue-500
${theme === "Dark" ? "text-white/20" : "text-blue-600/40"}`} />
                </div>
            </div>

            {/* Owner */}
            <div className="group">
                <label className="block text-[10px] sm:text-xs uppercase tracking-widest font-black mb-1 opacity-50 ml-1">Owner Name</label>
                <div className="relative">
                    <input type="text" placeholder="Full Name"
                        className={`w-full bg-transparent p-2.5 sm:p-3 pl-9 sm:pl-10 rounded-xl border-b-2 text-xs sm:text-sm outline-none
${theme === "Dark" ? "border-white/10 focus:border-blue-500 bg-white/5" : "border-black/5 focus:border-blue-700 bg-gray-50"}`}
                        value={adminRealName}
                        onChange={(e) => setAdminRealName(e.target.value)}
                    />
                    <FaUser className={`absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-sm sm:text-lg group-focus-within:text-blue-500
${theme === "Dark" ? "text-white/20" : "text-blue-600/40"}`} />
                </div>
            </div>

            {/* Email */}
            <div className="group">
                <label className="block text-[10px] sm:text-xs uppercase tracking-widest font-black mb-1 opacity-50 ml-1">Email</label>
                <div className="relative">
                    <input type="email" placeholder="admin@hotel.com"
                        className={`w-full bg-transparent p-2.5 sm:p-3 pl-9 sm:pl-10 rounded-xl border-b-2 text-xs sm:text-sm outline-none
${theme === "Dark" ? "border-white/10 focus:border-blue-500 bg-white/5" : "border-black/5 focus:border-blue-700 bg-gray-50"}`}
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                    />
                    <MdEmail className={`absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-sm sm:text-lg group-focus-within:text-blue-500
${theme === "Dark" ? "text-white/20" : "text-blue-600/40"}`} />
                </div>
            </div>

            {/* Password */}
            <div className="group">
                <label className="block text-[10px] sm:text-xs uppercase tracking-widest font-black mb-1 opacity-50 ml-1">Password</label>
                <div className="relative">
                    <input type={showPassword ? "text" : "password"} placeholder="6+ chars"
                        className={`w-full bg-transparent p-2.5 sm:p-3 pl-9 sm:pl-10 pr-9 sm:pr-10 rounded-xl border-b-2 text-xs sm:text-sm outline-none
${theme === "Dark" ? "border-white/10 focus:border-blue-500 bg-white/5" : "border-black/5 focus:border-blue-700 bg-gray-50"}`}
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                    />
                    <GiPadlock className={`absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-sm sm:text-lg`} />
                    <div className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 cursor-pointer opacity-30 hover:opacity-100"
                        onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                    </div>
                </div>
            </div>

            {/* Confirm */}
            <div className="group">
                <label className="block text-[10px] sm:text-xs uppercase tracking-widest font-black mb-1 opacity-50 ml-1">Confirm</label>
                <div className="relative">
                    <input type="password" placeholder="Repeat password"
                        className={`w-full bg-transparent p-2.5 sm:p-3 pl-9 sm:pl-10 rounded-xl border-b-2 text-xs sm:text-sm outline-none
${theme === "Dark" ? "border-white/10 focus:border-blue-500 bg-white/5" : "border-black/5 focus:border-blue-700 bg-gray-50"}`}
                        value={confirmpass}
                        onChange={(e) => setConfirmpass(e.target.value)}
                    />
                    <GiDialPadlock className={`absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-sm sm:text-lg`} />
                </div>
            </div>
        </div>

        {/* Button */}
        <div className="mt-6 sm:mt-8">
            <button
                onClick={registerUser}
                className={`w-full group flex items-center justify-center p-3 sm:p-4 text-xs sm:text-sm font-black uppercase tracking-widest rounded-2xl shadow-xl transition-all hover:scale-[1.02] active:scale-95
${theme === "Dark"
                        ? "bg-gradient-to-r from-blue-700 to-blue-500"
                        : "bg-gradient-to-r from-blue-600 to-blue-400"} text-white`}>
                <span>Create Account</span>
                <div className="ml-2 transition-transform duration-500 group-hover:translate-x-2">→</div>
            </button>
        </div>

        {/* Footer */}
        <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-white/5 text-center">
            <p className={`text-[10px] sm:text-[11px] uppercase tracking-widest ${theme === "Dark" ? "text-gray-500" : "text-gray-400"}`}>
                Already registered?{" "}
                <Link href="/allpages/user/login" className="text-blue-500 hover:text-blue-400 font-black ml-1">
                    Log In
                </Link>
            </p>
        </div>
    </div>
</div>
  );
};

export default Register;
