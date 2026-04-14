import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/dashboard/layout/DashboardLayout";
import {
  createMedicine,
  uploadMedicineExcel,
} from "../../services/medicine.Service";
import {
  getBrands,
  getDosage,
  getStrength,
  getCategory,
  getSupplier,
} from "../../services/setting.service"; // adjust path
type MedicineForm = {
  name: string;
  genericName: string;
  brandName: string;
  category: string;
  dosageForm: string;
  strength: string;
  manufacturer: string;
  supplier: string;
  stock: number;
  reorderLevel: number;
  unit: string;
  unitCost: number;
  sellingPrice: number;
  shelfLocation: string;
  batchNumber: string;
  manufacturingDate: string;
  expiryDate: string;
  barcode: string;
  prescriptionRequired: boolean;
  description: string;
  composition: string;
  storage: string;
};

const inputStyle =
  "w-full bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm";

const sectionStyle =
  "bg-white/70 backdrop-blur-xl border border-gray-200 rounded-3xl p-8 shadow-[0_15px_50px_rgba(0,0,0,0.06)] space-y-6";

const AddMedicine = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState<MedicineForm>({
    name: "",
    genericName: "",
    brandName: "",
    category: "Tablet",
    dosageForm: "",
    strength: "",
    manufacturer: "",
    supplier: "",
    stock: 0,
    reorderLevel: 10,
    unit: "Units",
    unitCost: 0,
    sellingPrice: 0,
    shelfLocation: "",
    batchNumber: "",
    manufacturingDate: "",
    expiryDate: "",
    barcode: "",
    prescriptionRequired: false,
    description: "",
    composition: "",
    storage: "",
  });
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvRows, setCsvRows] = useState<any[]>([]);
  const handleChange = (field: keyof MedicineForm, value: any) => {
    setForm({ ...form, [field]: value });
  };
  const [brands, setBrands] = useState<any[]>([]);
  const [dosages, setDosages] = useState<any[]>([]);
  const [strengths, setStrengths] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);

  const handleCSVUpload = (e: any) => {
    const file = e.target.files[0];

    console.log("📂 File input triggered");

    if (!file) {
      console.log("❌ No file chosen");
      return;
    }

    console.log("📁 Selected file:", file.name);

    setCsvFile(file);

    const reader = new FileReader();

    reader.onload = (event: any) => {
      const text = event.target.result;

      console.log("📄 File content preview:", text.slice(0, 200));

      const rows = text.split("\n").map((row: string) => row.split(","));

      console.log("📊 Parsed rows:", rows.length);

      setCsvRows(rows);
    };

    reader.readAsText(file);
  };

  useEffect(() => {
    fetchDropdownData();
  }, []);

  const fetchDropdownData = async () => {
    try {
      const [b, d, s, c, sup] = await Promise.all([
        getBrands(),
        getDosage(),
        getStrength(),
        getCategory(),
        getSupplier(),
      ]);

      // ✅ FIX HERE
      setBrands(Array.isArray(b) ? b : b.data || []);
      setDosages(Array.isArray(d) ? d : d.data || []);
      setStrengths(Array.isArray(s) ? s : s.data || []);
      setCategories(Array.isArray(c) ? c : c.data || []);
      setSuppliers(Array.isArray(sup) ? sup : sup.data || []);
    } catch (err) {
      console.error("Dropdown load error:", err);
    }
  };

  const handleSubmit = async () => {
    console.log("Manual submit button clicked");

    try {
      const payload = {
        name: form.name,
        generic_name: form.genericName,
        brand_id: form.brandName,
        category: form.category,
        dosage_form: form.dosageForm,
        strength: form.strength,
        manufacturer: form.manufacturer,
        supplier: form.supplier,
        quantity: Number(form.stock),
        reorder_level: Number(form.reorderLevel),
        unit: form.unit,
        unit_cost: Number(form.unitCost),
        selling_price: Number(form.sellingPrice),
        shelf_location: form.shelfLocation,
        batch_number: form.batchNumber,
        manufacturing_date: form.manufacturingDate,
        expiry_date: form.expiryDate,
        barcode: form.barcode,
        prescription_required: form.prescriptionRequired,
        description: form.description,
        composition: form.composition,
        storage: form.storage,
      };

      console.log("Payload being sent to API:", payload);

      const response = await createMedicine(payload);

      console.log("API response:", response);

      alert("Medicine added successfully");

      navigate("/medicine-store");
    } catch (error) {
      console.error("API error:", error);

      alert("Failed to add medicine");
    }
  };
  const handleCSVSubmit = async () => {
    try {
      console.log("📤 Upload button clicked");

      if (!csvFile) {
        console.log("❌ No file selected");
        alert("Please select CSV file");
        return;
      }

      console.log("📁 File selected:", csvFile);

      const formData = new FormData();
      formData.append("file", csvFile);

      console.log("📦 FormData ready");

      const res = await uploadMedicineExcel(csvFile); // ✅ correct
      console.log("✅ API response:", res);

      alert("CSV uploaded successfully");

      navigate("/medicine-store");
    } catch (error) {
      console.error("❌ Upload error:", error);
      alert("CSV upload failed");
    }
  };
  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-10">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* HEADER */}
          <div>
            <button
              onClick={() => navigate(-1)}
              className="text-blue-600 font-medium hover:opacity-70 transition mb-4"
            >
              ← Back
            </button>

            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Add New Medicine
            </h1>

            <p className="text-gray-500 mt-2">
              Fill in the details below to add medicine to inventory
            </p>
          </div>

          {/* FORM */}
          <div className="space-y-10">
            {/* BASIC INFO */}
            <div className={sectionStyle}>
              <h2 className="text-xl font-semibold text-gray-800">
                Basic Information
              </h2>

              <div className="grid grid-cols-2 gap-6">
                {/* Medicine Name */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-600">
                    Medicine Name
                  </label>
                  <input
                    className={inputStyle}
                    onChange={(e) => handleChange("name", e.target.value)}
                  />
                </div>

                {/* Generic Name */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-600">
                    Generic Name
                  </label>
                  <input
                    className={inputStyle}
                    onChange={(e) =>
                      handleChange("genericName", e.target.value)
                    }
                  />
                </div>

                {/* Brand Dropdown */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-600">
                    Brand Name
                  </label>
                  <select
                    className={inputStyle}
                    onChange={(e) => handleChange("brandName", e.target.value)}
                  >
                    {brands.length === 0 ? (
                      <option disabled>No data available</option>
                    ) : (
                      <>
                        <option value="">Select Brand</option>
                        {brands.map((b: any) => (
                          <option key={b.id || b._id} value={b.id || b._id}>
                            {b.name}
                          </option>
                        ))}
                      </>
                    )}
                  </select>
                </div>

                {/* Dosage Dropdown */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-600">
                    Dosage Form
                  </label>
                  <select
                    className={inputStyle}
                    onChange={(e) => handleChange("dosageForm", e.target.value)}
                  >
                    {dosages.length === 0 ? (
                      <option disabled>No data available</option>
                    ) : (
                      <>
                        <option value="">Select Dosage</option>
                        {dosages.map((d: any) => (
                          <option key={d.id || d._id} value={d.name}>
                            {d.name}
                          </option>
                        ))}
                      </>
                    )}
                  </select>
                </div>

                {/* Strength Dropdown */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-600">
                    Strength
                  </label>
                  <select
                    className={inputStyle}
                    onChange={(e) => handleChange("strength", e.target.value)}
                  >
                    {strengths.length === 0 ? (
                      <option disabled>No data available</option>
                    ) : (
                      <>
                        <option value="">Select Strength</option>
                        {strengths.map((s: any) => (
                          <option key={s.id || s._id} value={s.name}>
                            {s.name}
                          </option>
                        ))}
                      </>
                    )}
                  </select>
                </div>

                {/* Manufacturer */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-600">
                    Manufacturer
                  </label>
                  <input
                    className={inputStyle}
                    onChange={(e) =>
                      handleChange("manufacturer", e.target.value)
                    }
                  />
                </div>

                {/* Category Dropdown */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-600">
                    Category
                  </label>
                  <select
                    className={inputStyle}
                    onChange={(e) => handleChange("category", e.target.value)}
                  >
                    {categories.length === 0 ? (
                      <option disabled>No data available</option>
                    ) : (
                      <>
                        <option value="">Select Category</option>
                        {categories.map((c: any) => (
                          <option key={c.id || c._id} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </>
                    )}
                  </select>
                </div>

                {/* Supplier Dropdown */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-600">
                    Supplier
                  </label>
                  <select
                    className={inputStyle}
                    onChange={(e) => handleChange("supplier", e.target.value)}
                  >
                    {suppliers.length === 0 ? (
                      <option disabled>No data available</option>
                    ) : (
                      <>
                        <option value="">Select Supplier</option>
                        {suppliers.map((s: any) => (
                          <option key={s.id || s._id} value={s.name}>
                            {s.name}
                          </option>
                        ))}
                      </>
                    )}
                  </select>
                </div>
              </div>
            </div>

            {/* STOCK & PRICING */}
            <div className={sectionStyle}>
              <h2 className="text-xl font-semibold text-gray-800">
                Stock & Pricing
              </h2>

              <div className="grid grid-cols-3 gap-6">
                {[
                  ["Current Stock", "stock"],
                  ["Reorder Level", "reorderLevel"],
                  ["Unit", "unit"],
                  ["Unit Cost", "unitCost"],
                  ["Selling Price", "sellingPrice"],
                  ["Shelf Location", "shelfLocation"],
                ].map(([label, key]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium mb-2 text-gray-600">
                      {label}
                    </label>
                    <input
                      type={
                        key === "stock" ||
                        key === "reorderLevel" ||
                        key === "unitCost" ||
                        key === "sellingPrice"
                          ? "number"
                          : "text"
                      }
                      className={inputStyle}
                      onChange={(e) =>
                        handleChange(key as keyof MedicineForm, e.target.value)
                      }
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* BATCH & EXPIRY */}
            <div className={sectionStyle}>
              <h2 className="text-xl font-semibold text-gray-800">
                Batch & Expiry
              </h2>

              <div className="grid grid-cols-3 gap-6">
                {[
                  ["Batch Number", "batchNumber"],
                  ["Manufacturing Date", "manufacturingDate"],
                  ["Expiry Date", "expiryDate"],
                  ["Barcode", "barcode"],
                ].map(([label, key]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium mb-2 text-gray-600">
                      {label}
                    </label>
                    <input
                      type={key.includes("Date") ? "date" : "text"}
                      className={inputStyle}
                      onChange={(e) =>
                        handleChange(key as keyof MedicineForm, e.target.value)
                      }
                    />
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center gap-3">
                <input
                  type="checkbox"
                  className="w-5 h-5 accent-blue-600"
                  onChange={(e) =>
                    handleChange("prescriptionRequired", e.target.checked)
                  }
                />
                <span className="text-sm text-gray-600">
                  Prescription Required
                </span>
              </div>
            </div>

            {/* ADDITIONAL INFO */}
            <div className={sectionStyle}>
              <h2 className="text-xl font-semibold text-gray-800">
                Additional Information
              </h2>

              <textarea
                placeholder="Description"
                className={inputStyle + " h-24"}
                onChange={(e) => handleChange("description", e.target.value)}
              />

              <textarea
                placeholder="Composition"
                className={inputStyle + " h-24"}
                onChange={(e) => handleChange("composition", e.target.value)}
              />

              <input
                placeholder="Storage Conditions"
                className={inputStyle}
                onChange={(e) => handleChange("storage", e.target.value)}
              />
            </div>

            {/* CSV */}
            <div className={sectionStyle}>
              <h2 className="text-xl font-semibold text-gray-800">
                Bulk Upload (CSV)
              </h2>

              <input
                type="file"
                accept=".csv,.xlsx"
                onChange={handleCSVUpload}
                className="border border-dashed border-blue-400 rounded-2xl p-4 bg-blue-50 text-sm cursor-pointer"
              />

              {csvRows.length > 0 && (
                <div className="mt-4 text-sm text-green-600">
                  ✓ CSV Loaded ({csvRows.length} rows)
                </div>
              )}
            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex justify-end gap-6 pt-4">
            <button
              onClick={() => navigate(-1)}
              className="px-8 py-3 rounded-2xl border border-gray-300 hover:bg-gray-100 transition"
            >
              Cancel
            </button>

            {/* CSV Upload Button */}
            <button
              onClick={handleCSVSubmit}
              className="px-10 py-3 rounded-2xl bg-green-600 text-white font-semibold shadow-lg hover:scale-[1.04] transition-all duration-200"
            >
              Upload CSV
            </button>

            {/* Manual Save */}
            <button
              onClick={handleSubmit}
              className="px-10 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg hover:scale-[1.04] transition-all duration-200"
            >
              Save Medicine
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AddMedicine;
