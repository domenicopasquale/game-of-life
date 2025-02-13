import Navbar from "./Navbar";

function BaseLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        {children}
      </main>
    </>
  );
}

export default BaseLayout; 