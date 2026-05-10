type LoginApiCallProps = {
  email: string;
  password: string;

  router: any;

  setError: (msg: string) => void;
  setIsLoading: (loading: boolean) => void;
  setOtpEmail: (email: string) => void;
};

const loginApiCall = async ({
  email,
  password,
  router,
  setError,
  setIsLoading,
  setOtpEmail,
}: LoginApiCallProps) => {
  try {
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Login failed");
    }

    console.log("Login successful:", data);

    setOtpEmail(email);

    router.push("/verify-login");
  } catch (error: any) {
    setError(error.message || "Something went wrong");
  } finally {
    setIsLoading(false);
  }
};

export default loginApiCall;