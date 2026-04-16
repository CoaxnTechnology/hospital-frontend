import { useEffect, useRef, useState } from "react";
import { getAppointments } from "../../services/appointment.Service";

const PatientQueueTV = () => {
  const [patients, setPatients] = useState<any[]>([]);
  const prevPatientsRef = useRef<any[]>([]);

  const speak = (text: string) => {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-IN";
    window.speechSynthesis.speak(speech);
  };

  const loadPatients = async () => {
    const res = await getAppointments("today");
    const data = res.data || [];

    checkVoice(data);

    prevPatientsRef.current = data;
    setPatients(data);
  };

  const checkVoice = (newPatients: any[]) => {
    const prev = prevPatientsRef.current;

    newPatients.forEach((p, index) => {
      const prevPatient = prev.find((x) => x.id === p.id);

      const current = p.status?.toLowerCase().trim();
      const old = prevPatient?.status?.toLowerCase().trim();

      if (current === "in consultation" && old !== "in consultation") {
        const token = p.token_number || index + 1;
        speak(`Token number ${token}, please come`);
      }
    });
  };

  useEffect(() => {
    loadPatients();
    const interval = setInterval(loadPatients, 5000);
    return () => clearInterval(interval);
  }, []);

  const activePatients = patients.filter(
    (p) => p.status?.toLowerCase().trim() !== "completed",
  );

  const currentPatient = activePatients.find(
    (p) => p.status?.toLowerCase().trim() === "in consultation",
  );

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* 🔥 TOP DISPLAY */}
      <div className="text-center mb-10">
        <h1 className="text-6xl font-bold mb-4 text-yellow-400">Now Serving</h1>

        {currentPatient ? (
          <>
            <div className="text-[120px] font-bold text-green-400 animate-pulse">
              {currentPatient.token_number}
            </div>

            <div className="text-4xl mt-4">{currentPatient.patient_name}</div>

            <div className="text-2xl mt-2 text-gray-300">
             {currentPatient.doctor_name}
            </div>
          </>
        ) : (
          <div className="text-3xl text-gray-400">
            Waiting for next patient...
          </div>
        )}
      </div>

      {/* 🔽 QUEUE LIST */}
      <div className="max-w-6xl mx-auto">
        <table className="w-full text-center border border-gray-700">
          <thead>
            <tr className="bg-gray-800 text-lg">
              <th className="p-3">Token</th>
              <th className="p-3">Patient</th>
              <th className="p-3">Mobile</th> {/* ✅ NEW */}
              <th className="p-3">Age</th> {/* ✅ NEW */}
              <th className="p-3">Doctor</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {activePatients.map((p, i) => {
              const status = p.status?.toLowerCase().trim();

              return (
                <tr
                  key={p.id}
                  className={`border-t border-gray-700
                    ${
                      status === "in consultation"
                        ? "bg-green-700 text-white"
                        : "bg-gray-900"
                    }
                  `}
                >
                  <td className="p-3 text-xl">{p.token_number || i + 1}</td>

                  <td className="p-3">{p.patient_name}</td>

                  {/* ✅ MOBILE */}
                  <td className="p-3">{p.patient_phone || "-"}</td>

                  {/* ✅ AGE */}
                  <td className="p-3">{p.age || "-"}</td>

                  <td className="p-3">{p.doctor_name}</td>

                  <td className="p-3">{p.status}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PatientQueueTV;
