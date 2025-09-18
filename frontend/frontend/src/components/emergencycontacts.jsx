import React from "react";
import contacts from "../data/emergencyContacts.json";
import { useTranslation } from "react-i18next";
import { Phone } from "lucide-react"; // optional; remove if not using lucide-react

const EmergencyContacts = () => {
  const { t } = useTranslation();

  return (
    <div className=" backdrop-blur-md text-white border border-white/20
 rounded-2xl shadow-xl p-6">
      <h2 className="text-xl font-bold mb-4">{t("emergency_contacts")}</h2>
      <ul className="space-y-3">
        {contacts.map((c, idx) => (
          <li
            key={idx}
            className="flex items-center justify-between border rounded-xl p-3"
          >
            <div>
              <p className="font-semibold">{c.name}</p>
              <p className="text-sm text-gray-600">{c.phone}</p>
            </div>
            <a
              href={`tel:${c.phone}`}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700"
            >
              <Phone className="w-4 h-4" />
              {t("call")}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmergencyContacts;
