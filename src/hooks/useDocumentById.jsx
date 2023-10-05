import { useState, useEffect } from "react";
import getDocumentById from "../api/services/Status/getStatus";

const useDocumentById = (collection, documentId) => {
  const [documentData, setDocumentData] = useState({});

  useEffect(() => {
    if (!collection || !documentId) return;
    const unsubscribe = getDocumentById(
      collection,
      documentId,
      setDocumentData
    );

    return () => {
      unsubscribe();
    };
  }, [collection, documentId]);

  return { documentData };
};

export default useDocumentById;
