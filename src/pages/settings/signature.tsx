const BASE_URL = import.meta.env.VITE_BASE_URL;
import { useState, useRef } from "react";
import DashboardLayout from "../../components/dashboard/layout/DashboardLayout";
import { uploadSignature, getSignature } from "../../services/setting.service";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import imageCompression from "browser-image-compression";
const Signature = () => {
  const [file, setFile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signatureUrl, setSignatureUrl] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSignature();
  }, []);

  const fetchSignature = async () => {
    try {
      const res = await getSignature();

      console.log("🖊 SIGNATURE API:", res);

      // 🔥 ADD THIS LINE
      console.log("📷 RAW SIGNATURE PATH:", res?.data?.signature);

      if (res?.data?.signature) {
        const fullUrl = `${BASE_URL}${res.data.signature}`;

        // 🔥 ADD THIS LINE
        console.log("🌐 FINAL IMAGE URL:", fullUrl);

        setSignatureUrl(fullUrl);
      }
    } catch (err) {
      console.error(err);
    }
  };
  // 🎯 START DRAW
  const startDraw = (e: any) => {
    const ctx = canvasRef.current.getContext("2d");

    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);

    setIsDrawing(true);
  };

  // 🎯 DRAW
  const draw = (e: any) => {
    if (!isDrawing) return;

    const ctx = canvasRef.current.getContext("2d");

    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#000";

    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
  };

  // 🎯 STOP DRAW
  const stopDraw = () => {
    setIsDrawing(false);
  };

  // 🎯 CLEAR
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // 🎯 SAVE DRAW SIGNATURE
  const saveDrawnSignature = async () => {
    try {
      setLoading(true);

      const canvas = canvasRef.current;
      const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
      const blob = await (await fetch(dataUrl)).blob();

      const fd = new FormData();
      fd.append("signature", blob, "signature.jpg");

      const res = await uploadSignature(fd);

      if (!res?.success) throw new Error();

      alert("Signature saved");
    } catch (err) {
      console.error(err);
      alert("Error saving signature");
    } finally {
      setLoading(false);
    }
  };

  // 🎯 UPLOAD FILE
  const uploadFile = async () => {
    if (!file) return alert("Select file");

    try {
      setLoading(true);

      const fd = new FormData();
      fd.append("signature", file);

      const res = await uploadSignature(fd);

      if (!res?.success) throw new Error();

      alert("Signature uploaded");
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
        {/* HEADER */}
        <div>
          <button
            onClick={() => navigate("/settings")}
            className="text-blue-600 text-sm hover:underline"
          >
            ← Back
          </button>

          <h2 className="text-2xl font-semibold mt-2">Doctor Signature</h2>

          <p className="text-gray-500 text-sm">Draw or upload your signature</p>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* DRAW CARD */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-gray-700">Draw Signature</h3>

              <button
                onClick={clearCanvas}
                className="text-sm text-red-500 hover:underline"
              >
                Clear
              </button>
            </div>

            <canvas
              ref={canvasRef}
              width={500}
              height={200}
              className="w-full border rounded-lg bg-white"
              onMouseDown={startDraw}
              onMouseUp={stopDraw}
              onMouseLeave={stopDraw}
              onMouseMove={draw}
            />

            <button
              onClick={saveDrawnSignature}
              disabled={loading}
              className={`w-full py-2 rounded-lg text-white ${
                loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Saving..." : "Save Signature"}
            </button>
          </div>

          {/* UPLOAD CARD */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border space-y-4">
            <h3 className="font-semibold text-gray-700">Upload Signature</h3>

            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <input
                type="file"
                accept="image/png, image/jpeg"
                onChange={async (e: any) => {
                  const file = e.target.files[0];
                  if (!file) return;

                  // 🔥 TYPE CHECK
                  if (!file.type.startsWith("image/")) {
                    alert("❌ Only image files allowed");
                    return;
                  }

                  console.log("📦 Original size:", file.size / 1024, "KB");

                  const maxSize = 200 * 1024;

                  // ✅ SMALL FILE → NO COMPRESSION
                  if (file.size <= maxSize) {
                    console.log("✅ Under 200KB → no compression");
                    setFile(file);
                    setSignatureUrl(URL.createObjectURL(file));
                    return;
                  }

                  console.log("⚡ Large signature → compressing...");

                  // 🔥 COMPRESS FUNCTION
                  const compressSignature = async (file: File) => {
                    let quality = 0.9;
                    let compressed = file;
                    let attempts = 0;

                    while (
                      compressed.size > maxSize &&
                      quality > 0.4 &&
                      attempts < 6
                    ) {
                      const options = {
                        maxSizeMB: 0.5,
                        maxWidthOrHeight: 800,
                        initialQuality: quality,
                        useWebWorker: true,
                      };

                      compressed = await imageCompression(compressed, options);
                      quality -= 0.1;
                      attempts++;
                    }

                    return compressed;
                  };

                  try {
                    const compressedFile = await compressSignature(file);

                    console.log(
                      "✅ Compressed size:",
                      compressedFile.size / 1024,
                      "KB",
                    );

                    setFile(compressedFile);
                    setSignatureUrl(URL.createObjectURL(compressedFile)); // 🔥 ADD THIS
                  } catch (err) {
                    console.error("❌ Compression error", err);
                    alert("Compression failed");
                  }
                }}
                className="mb-3"
              />
            </div>

            <button
              onClick={uploadFile}
              disabled={loading}
              className={`w-full py-2 rounded-lg text-white ${
                loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {loading ? "Uploading..." : "Upload Signature"}
            </button>
          </div>
          {signatureUrl && (
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-500 mb-2">Saved Signature</p>

              <img
                src={signatureUrl}
                alt="signature"
                onError={() =>
                  console.log("❌ IMAGE LOAD FAILED:", signatureUrl)
                }
                onLoad={() => console.log("✅ IMAGE LOADED:", signatureUrl)}
                className="h-20 mx-auto object-contain border p-2 rounded"
              />
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Signature;
