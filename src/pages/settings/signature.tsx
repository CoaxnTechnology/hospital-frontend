const BASE_URL = import.meta.env.VITE_BASE_URL;
import { useState, useRef } from "react";
import DashboardLayout from "../../components/dashboard/layout/DashboardLayout";
import { uploadSignature, getSignature } from "../../services/setting.service";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
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

      if (res?.data?.signature) {
        setSignatureUrl(`${BASE_URL}${res.data.signature}`);
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
      const dataUrl = canvas.toDataURL("image/png");

      const blob = await (await fetch(dataUrl)).blob();

      const fd = new FormData();
      fd.append("signature", blob, "signature.png");

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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                onChange={(e: any) => setFile(e.target.files[0])}
                className="mb-3"
              />

              <p className="text-xs text-gray-400">
                PNG / JPG format recommended
              </p>
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
