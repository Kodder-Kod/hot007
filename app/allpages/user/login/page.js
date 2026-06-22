"use client"

import React, { useState } from 'react';
import { db } from "../../../../config";
import { signInWithEmailAndPassword, sendPasswordResetEmail, getAuth } from "firebase/auth";
import { ref, get } from 'firebase/database';
import { useUserAccountName, useUserEmail, useUserID, useUserName, useUserPhone, useUserRole } from '../../../componets/zustand/profile';
import { MdEmail } from "react-icons/md";
import { GiPadlock } from "react-icons/gi";
import { useUserTheme } from '@/app/componets/zustand/theme';
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import Link from 'next/link';

const LogIn = () => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [forgotemail, setForgetemail] = useState("");
    const [isModalOpen, setModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const theme = useUserTheme((state) => state.userTheme);
    const auth = getAuth();

    const handleForgotPassword = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);



    const changepassword = async () => {
        if (!forgotemail) return;
        try {
            await sendPasswordResetEmail(auth, forgotemail);
            setForgetemail("");
            setErrorMessage("Reset link sent!");
        } catch (error) {
            console.log("error on reset", error);
            setForgetemail("");
            setErrorMessage("Failed to send reset link!");
        }
    };


    const LoginUser = async () => {
        if (!name || !password) {
            setErrorMessage("Email and Password are required!");
            return;
        }

        try {
            const userCredential = await signInWithEmailAndPassword(auth, name, password);
            const user = userCredential.user;

            setErrorMessage("");
            setName('');
            setPassword('');

            await fetchRole(name);

        } catch (error) {
            console.log(error.message);
            setErrorMessage("Invalid email or password!");
            setName('');
            setPassword('');
        }
    };

    const fetchRole = async (email) => {
        const snapshot = await get(ref(db, `user/accounts/`));
        const data = snapshot.val();

        if (data) {
            let emailUser = null, id = null, accountUser = null, nameUser = null, phoneUser = null, roleUser = null;
            Object.entries(data).forEach(([key, value]) => {
                if (value.Email === email) {
                    emailUser = value.Email;
                    nameUser = value.Name;
                    phoneUser = value.Phone;
                    id = value.Id;
                    roleUser = value.Role;
                    accountUser = value.UserName
                }
            });
            useUserID.setState({ userID: id });
            useUserEmail.setState({ userEmail: emailUser });
            useUserPhone.setState({ userPhone: phoneUser });
            useUserName.setState({ userName: nameUser });
            useUserAccountName.setState({ userAccountName: accountUser });
            useUserRole.setState({ userRole: roleUser });

        }

    };


    const [showPassword, setShowPassword] = useState(false);

    return (
     <div className={`relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 overflow-hidden transition-colors duration-500
${theme === "Dark" ? "bg-[#0f1026]" : "bg-gray-100"}`}>

    {/* --- BACKGROUND DECORATION --- */}
    <div className={`absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] opacity-20 
${theme === "Dark" ? "bg-blue-600" : "bg-blue-400"}`}></div>

    <div className={`absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full blur-[100px] opacity-20 
${theme === "Dark" ? "bg-indigo-800" : "bg-blue-300"}`}></div>

    <div className="absolute top-20 right-[15%] w-16 sm:w-24 h-16 sm:h-24 border-4 border-blue-500/10 rounded-full animate-bounce" style={{ animationDuration: '6s' }}></div>

    <div className="absolute bottom-40 left-[10%] w-12 sm:w-16 h-12 sm:h-16 border-2 border-indigo-500/20 rotate-45 animate-pulse"></div>

    <div className={`absolute inset-0 opacity-[0.03] ${theme === "Dark" ? "invert" : ""}`}
        style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/carbon-fibre.png")` }}>
    </div>

    {/* --- MAIN LOGIN CARD --- */}
    <div className={`relative z-10 shadow-2xl rounded-[2.5rem] p-6 sm:p-8 md:p-10 max-w-md w-full overflow-hidden backdrop-blur-sm
${theme === "Dark"
            ? "bg-gradient-to-b from-[#132962]/95 to-[#0f1026]/98 border border-white/10"
            : "bg-white/90 border border-gray-200"}`}>

        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl"></div>

        {/* Header */}
        <div className="flex items-center gap-3 sm:gap-5 mb-8 sm:mb-12">
            <div className="shrink-0 relative">
                <div className="absolute inset-0 bg-blue-500 blur-md opacity-20"></div>
                <img src="/logo.png" alt="Logo" className="relative h-10 sm:h-12 md:h-14 w-auto shadow-xl rounded-2xl" />
            </div>

            <div className={`h-10 sm:h-12 w-[2px] rounded-full ${theme === "Dark" ? "bg-white/10" : "bg-blue-700/20"}`}></div>

            <div>
                <h1 className={`text-xs sm:text-sm md:text-xl font-black leading-tight uppercase tracking-[0.1em] ${theme === "Dark" ? "text-white" : "text-blue-700"}`}>
                    Hotel<br />
                    <span className="text-blue-500">Management System</span>
                </h1>
            </div>
        </div>

        {/* Title */}
        <div className="mb-8 sm:mb-10">
            <h2 className={`text-lg sm:text-xl md:text-3xl font-bold tracking-tight ${theme === "Dark" ? "text-white" : "text-gray-900"}`}>
                Log In
            </h2>
            <div className="h-1 w-10 sm:w-12 bg-blue-500 mt-2 rounded-full"></div>
            <p className={`text-xs sm:text-sm mt-3 sm:mt-4 font-medium ${theme === "Dark" ? "text-gray-400" : "text-gray-500"}`}>
                Secure access to your portal.
            </p>
        </div>

        {/* Error */}
        {errorMessage && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-500/10 text-red-500 border-l-4 border-red-500 text-xs font-bold uppercase tracking-wider">
                {errorMessage}
            </div>
        )}

        <div className="space-y-5 sm:space-y-7">

            {/* Email */}
            <div className="group">
                <p className="text-xs sm:text-sm font-black mb-1 sm:mb-2 ml-1 opacity-50">STAFF EMAIL</p>
                <div className="relative">
                    <input
                        type="email"
                        placeholder="john.doe@hotel.com"
                        className={`w-full bg-transparent p-3 sm:p-4 pl-10 sm:pl-12 rounded-2xl border text-xs sm:text-sm transition-all duration-500 outline-none
${theme === "Dark"
                                ? "border-white/5 focus:border-blue-500 focus:bg-white/5"
                                : "border-black/5 focus:border-blue-700 focus:bg-gray-50"}`}
                        style={{ color: theme === "Dark" ? "#FFFFFF" : "#000000" }}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <MdEmail className={`absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-lg sm:text-2xl group-focus-within:text-blue-500
${theme === "Dark" ? "text-white/20" : "text-blue-600/40"}`} />
                </div>
            </div>

            {/* Password */}
            <div className="group">
                <div className="flex justify-between items-end mb-1 sm:mb-2 px-1">
                    <p className="text-xs sm:text-sm font-black opacity-50">PASSWORD</p>
                </div>

                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className={`w-full bg-transparent p-3 sm:p-4 pl-10 sm:pl-12 pr-10 sm:pr-12 rounded-2xl border text-xs sm:text-sm transition-all duration-500 outline-none
${theme === "Dark"
                                ? "border-white/5 focus:border-blue-500 focus:bg-white/5"
                                : "border-black/5 focus:border-blue-700 focus:bg-gray-50"}`}
                        style={{ color: theme === "Dark" ? "#FFFFFF" : "#000000" }}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <GiPadlock className={`absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-lg sm:text-2xl group-focus-within:text-blue-500
${theme === "Dark" ? "text-white/20" : "text-blue-600/40"}`} />

                    <div
                        className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 cursor-pointer text-lg sm:text-xl opacity-30 hover:opacity-100 transition-opacity"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                    </div>
                </div>
            </div>

            {/* Button */}
            <button
                onClick={LoginUser}
                className={`w-full group relative flex items-center justify-center p-3 sm:p-4 overflow-hidden font-black uppercase tracking-widest rounded-2xl shadow-[0_10px_30px_-10px_rgba(59,130,246,0.5)] transition-all hover:scale-[1.02] active:scale-95
${theme === "Dark"
                        ? "bg-gradient-to-r from-blue-700 to-blue-500"
                        : "bg-gradient-to-r from-blue-600 to-blue-400"} text-white`}
            >
                <span className="relative z-10 mr-2 text-xs sm:text-sm">Authorize</span>
                <div className="transition-transform duration-500 group-hover:translate-x-3">
                    →
                </div>
            </button>
        </div>

        {/* Lost Access */}
        <button
            onClick={handleForgotPassword}
            className="mt-4 sm:mt-6 text-xs text-blue-500 hover:text-blue-400 font-black uppercase tracking-widest transition-colors block text-left"
        >
            Lost Access?
        </button>

        {/* Footer */}
        <div className="mt-6 pt-6 sm:pt-8 border-t border-white/5 text-center">
            <p className={`text-[10px] sm:text-[11px] uppercase tracking-widest ${theme === "Dark" ? "text-gray-500" : "text-gray-400"}`}>
                Not registered?{" "}
                <Link href="/allpages/user/register" className="text-blue-500 hover:text-blue-400 font-black transition-colors ml-1">
                    Create Business Account
                </Link>
            </p>
        </div>
    </div>
</div>
    );
};

export default LogIn;
