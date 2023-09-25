const { CircularProgress } = require("@mui/material");

const LoadingSpinner = ({ isSubmitting }) => {
  return (
    <>
      {isSubmitting && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(255, 255, 255, 0)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100000,
            width: "100%",
            height: "100%",
          }}
        >
          <div
            style={{
              width: "50px",
              height: "50px",
              marginBottom: "20px",
            }}
          >
            <CircularProgress
              style={{ color: "white", width: "100%", height: "100%" }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default LoadingSpinner;
