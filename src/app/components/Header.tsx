"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { SessionState } from "../utils/interface";
import { setDestroyAuth, setLoggedInUser } from "../redux/slices/session.slice";
import { AppDispatch } from "../redux/store";

const Header = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [isDropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const { isUserLoggedIn, me } = useSelector(
    (state: { session: SessionState }) => state.session
  );

  const INACTIVITY_TIMEOUT = 5 * 60 * 1000; 
  const WARNING_DURATION = 60 * 1000; 
  const [showWarning, setShowWarning] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(60);

  const logoutTimerRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = useCallback(() => {
    if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
    if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);

    setShowWarning(false);
    setCountdown(60);

    warningTimerRef.current = setTimeout(() => {
      setShowWarning(true);
      startCountdown();
    }, INACTIVITY_TIMEOUT - WARNING_DURATION);

    logoutTimerRef.current = setTimeout(() => {
      handleLogoutNow();
    }, INACTIVITY_TIMEOUT);
  }, []);

  const startCountdown = () => {
    let count = 60;
    setCountdown(count);
    countdownIntervalRef.current = setInterval(() => {
      count -= 1;
      setCountdown(count);
      if (count <= 0 && countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    }, 1000);
  };

  const handleStayLoggedIn = () => {
    setShowWarning(false);
    resetTimer();
  };

  const handleLogoutNow = () => {
    if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
    if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    dispatch(setDestroyAuth());
    router.push("/auth/login");
  };

  useEffect(() => {
    const events = ["mousemove", "keydown", "click", "scroll"];

    const handleUserActivity = () => resetTimer();

    events.forEach((event) => window.addEventListener(event, handleUserActivity));

    resetTimer(); 

    return () => {
      events.forEach((event) => window.removeEventListener(event, handleUserActivity));
      if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
      if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, [resetTimer]);

  useEffect(() => {
    if (isUserLoggedIn) {
      dispatch(setLoggedInUser());
    } else {
      router.push("/auth/login");
    }
  }, [dispatch, isUserLoggedIn, router]);

  return (
    <>
      <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">My Todo App</h1>
        {isUserLoggedIn && me && (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 focus:outline-none"
            >
              <img
                src={me.image || "/default-avatar.png"} 
                alt="User Avatar"
                className="w-8 h-8 rounded-full border border-white"
              />
              <span>{me?.firstName} {me?.lastName}</span>
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg p-2">
                <button className="w-full text-left p-2 hover:bg-gray-200" onClick={() => router.push("/dashboard/profile")}>
                  Profile
                </button>
                <button className="w-full text-left p-2 hover:bg-gray-200" onClick={handleLogoutNow}>
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      {showWarning && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-xl font-bold text-red-600">Inactivity Warning!</h2>
            <p className="mt-2 text-lg">
              You will be logged out in <b>{countdown}</b> seconds.
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Do you want to stay logged in?
            </p>
            <div className="mt-4 flex justify-center space-x-4">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg" onClick={handleStayLoggedIn}>
                Stay Logged In
              </button>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg" onClick={handleLogoutNow}>
                Logout Now
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
