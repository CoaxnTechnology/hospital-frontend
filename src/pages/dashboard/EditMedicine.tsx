import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../components/dashboard/layout/DashboardLayout";
import {
  getMedicineById,
  updateMedicine,
} from "../../services/medicine.Service";
import {
  getBrands,
  getDosage,
  getStrength,
  getCategory,
  getSupplier,
} from "../../services/setting.service";
import { useEffect } from "react";
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

const EditMedicine = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  console.log("Medicine ID:", id);
  const [brands, setBrands] = useState<any[]>([]);
  const [dosages, setDosages] = useState<any[]>([]);
  const [strengths, setStrengths] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [form, setForm] = useState<MedicineForm>({
    name: "Paracetamol",
    genericName: "Acetaminophen",
    brandName: "Crocin",
    category: "Tablet",
    dosageForm: "Tablet",
    strength: "500mg",
    manufacturer: "ABC Pharma",
    supplier: "XYZ Supplier",
    stock: 100,
    reorderLevel: 10,
    unit: "Units",
    unitCost: 5,
    sellingPrice: 10,
    shelfLocation: "Rack A1",
    batchNumber: "BATCH123",
    manufacturingDate: "2024-01-01",
    expiryDate: "2026-01-01",
    barcode: "123456789",
    prescriptionRequired: false,
    description: "",
    composition: "",
    storage: "",
  });
  const formatInputDate = (date: string) => {
    if (!date) return "";
    return new Date(date).toISOString().split("T")[0];
  };
  useEffect(() => {
    const fetchMedicine = async () => {
      if (!id) return;

      try {
        const res = await getMedicineById(Number(id));
        console.log("Fetched medicine data:", res);
        const med = res.data;

        setForm({
          name: med.name || "",
          genericName: med.generic_name || "",
          brandName: med.brand_id || "",
          category: med.category || "",
          dosageForm: med.dosage_form || "",
          strength: med.strength || "",
          manufacturer: med.manufacturer || "",
          supplier: med.supplier || "",
          stock: med.quantity || 0,
          reorderLevel: med.reorder_level || 0,
          unit: med.unit || "",
          unitCost: med.unit_cost || 0,
          sellingPrice: med.selling_price || 0,
          shelfLocation: med.shelf_location || "",
          batchNumber: med.batch_number || "",
          manufacturingDate: formatInputDate(med.manufacturing_date),
          expiryDate: formatInputDate(med.expiry_date),
          barcode: med.barcode || "",
          prescriptionRequired: !!med.prescription_required,
          description: med.description || "",
          composition: med.composition || "",
          storage: med.storage || "",
        });
      } catch (error) {
        console.error("Error loading medicine", error);
      }
    };

    fetchMedicine();
  }, [id]);
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

      setBrands(Array.isArray(b) ? b : b.data || []);
      setDosages(Array.isArray(d) ? d : d.data || []);
      setStrengths(Array.isArray(s) ? s : s.data || []);
      setCategories(Array.isArray(c) ? c : c.data || []);
      setSuppliers(Array.isArray(sup) ? sup : sup.data || []);
    } catch (err) {
      console.error(err);
    }
  };
  const handleChange = (field: keyof MedicineForm, value: any) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

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

      await updateMedicine(Number(id), payload);

      alert("Medicine updated successfully");

      navigate("/medicine-store");
    } catch (error) {
      console.error("Update failed", error);
      alert("Failed to update medicine");
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
              Edit Medicine
            </h1>

            <p className="text-gray-500 mt-2">Update medicine details</p>
          </div>

          <form className="space-y-10" onSubmit={handleSubmit}>
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
                    value={form.name}
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
                    value={form.genericName}
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
                    value={form.brandName}
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
                    value={form.dosageForm}
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
                    value={form.strength}
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
                    value={form.manufacturer}
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
                    value={form.category}
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
                    value={form.supplier}
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
                      value={form[key as keyof MedicineForm] as any}
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
                      value={form[key as keyof MedicineForm] as any}
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
                  checked={form.prescriptionRequired}
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
                value={form.description}
                placeholder="Description"
                className={inputStyle + " h-24"}
                onChange={(e) => handleChange("description", e.target.value)}
              />

              <textarea
                value={form.composition}
                placeholder="Composition"
                className={inputStyle + " h-24"}
                onChange={(e) => handleChange("composition", e.target.value)}
              />

              <input
                value={form.storage}
                placeholder="Storage Conditions"
                className={inputStyle}
                onChange={(e) => handleChange("storage", e.target.value)}
              />
            </div>

            {/* BUTTONS */}
            <div className="flex justify-end gap-6 pt-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-8 py-3 rounded-2xl border border-gray-300 hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-10 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg hover:scale-[1.04] transition-all duration-200"
              >
                Update Medicine
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EditMedicine;
