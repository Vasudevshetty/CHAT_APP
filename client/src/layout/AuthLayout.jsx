function AuthLayout({ children }) {
  return (
    <>
      <header className="flex justify-center items-center py-3 h-20 shadow-md bg-white">
        <img src="/logo.png" alt="logo" height={180} width={180} />
      </header>

      {children}
    </>
  );
}

export default AuthLayout;
