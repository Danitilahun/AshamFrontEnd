const { CircularProgress } = require("@mui/material");

const LoadingSpinner = ({ isSubmitting }) => {
  return (
    <>
      {isSubmitting && (
        <div
          style={{
            position: "absolute",
            content: "",
            top: 0,
            left: 0,
            /* background: "rgba(255, 255, 255, 0)" */
            background: "black",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 3000,
            width: "1920px",
            height: "1080px",
            display: "none"
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
