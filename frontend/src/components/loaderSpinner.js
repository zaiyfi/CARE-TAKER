const LoaderSpinner = () => {
  return (
    <div className="h h-full w-full bg-black bg-opacity-50 z-[9999] fixed top-0 flex justify-center items-center ">
      <div className="w-10 h-10 border-4 border-solid border-neutral-700 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default LoaderSpinner;
