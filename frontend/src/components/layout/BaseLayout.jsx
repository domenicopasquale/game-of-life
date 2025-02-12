import Navbar from "./Navbar";

function BaseLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        {children}
      </main>
    </>
  );
}

export default BaseLayout; 