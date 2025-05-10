"use client"
import { useState } from "react";

export default function Home() {
  const [formData, setFormData] = useState({
    age: 50,
    gender: 1,
    height: 170,
    weight: 70,
    ap_hi: 120,
    ap_lo: 80,
    cholesterol: 1,
    gluc: 1,
    smoke: 0,
    alco: 0,
    active: 1,
    cardio: 0,
    age_years: 50,
    bmi: 24.2,
    bp_category: "normal",
    bp_category_encoded: "0",
  });

  const [prediction, setPrediction] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, age: parseInt(formData.age.toString()), age_years: parseInt(formData.age_years.toString()), height: parseFloat(formData.height.toString()), weight: parseFloat(formData.weight.toString()), ap_hi: parseInt(formData.ap_hi.toString()), ap_lo: parseInt(formData.ap_lo.toString()), cholesterol: parseInt(formData.cholesterol.toString()), gluc: parseInt(formData.gluc.toString()), smoke: parseInt(formData.smoke.toString()), alco: parseInt(formData.alco.toString()), active: parseInt(formData.active.toString()), gender: parseInt(formData.gender.toString()), cardio: parseInt(formData.cardio.toString()) }),
      });
      const data = await res.json();
      setPrediction(data.predictions[0]);
    } catch (err) {
      console.error(err);
      setPrediction("Error fetching prediction");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-lg w-full">
        <h1 className="text-2xl font-bold mb-4">Health Prediction</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {Object.keys(formData).map((key) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 capitalize">{key.replace("_", " ")}</label>
              <input
                type="text"
                name={key}
                value={formData[key as keyof typeof formData]}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          ))}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
            disabled={loading}
          >
            {loading ? "Predicting..." : "Get Prediction"}
          </button>
        </form>
        {prediction !== null && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg text-center">
            <p className="text-lg font-semibold">Prediction: {prediction}</p>
          </div>
        )}
      </div>
    </div>
  );
}
