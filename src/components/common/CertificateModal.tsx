import React, { useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Award, Download, Printer, X, CheckCircle, ShieldCheck } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const CertificateModal: React.FC = () => {
  const { selectedCertificate, setSelectedCertificate, language } = useApp();
  const certRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = React.useState(false);

  if (!selectedCertificate) return null;

  const handleDownload = async () => {
    if (!certRef.current || !selectedCertificate) return;
    if (isDownloading) return;

    setIsDownloading(true);

    try {
      const canvas = await html2canvas(certRef.current, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
        width: certRef.current.scrollWidth,
        height: certRef.current.scrollHeight,
      });

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
        compress: true,
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(
        imgData,
        "PNG",
        0,
        0,
        pageWidth,
        pageHeight,
        undefined,
        "FAST"
      );

      const fileName = `Certificat-${selectedCertificate.userName.replace(/\s+/g, "_")}.pdf`;
      pdf.save(fileName);

    } catch (error) {
      console.error("Erreur lors du téléchargement :", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 my-8">
        
        {/* Modal Controls Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gray-900 text-white border-b border-gray-800">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#E63946]" />
            <span className="font-semibold text-sm">
              {language === 'fr' ? 'Certificat d\'Aptitude & Réussite Officiel' : 'Official Certificate of Achievement'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-sm font-semibold text-white transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              {language === "fr" ? "Imprimer" : "Print"}
            </button>
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#E63946] hover:bg-[#B72430] text-sm font-semibold text-white transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              {isDownloading 
                ? (language === "fr" ? "Téléchargement..." : "Downloading...") 
                : (language === "fr" ? "Télécharger" : "Download")}
            </button>
            <button
              onClick={() => setSelectedCertificate(null)}
              className="p-1.5 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Frame Content (Printable target) */}
        <div className="p-6 md:p-10 bg-slate-50 flex justify-center">
          <div
            ref={certRef}
            className="printable-certificate relative w-full bg-white p-8 md:p-12 rounded-xl shadow-xl border-8 border-double border-[#B72430] text-gray-900 text-center overflow-hidden"
            style={{
              backgroundImage: 'radial-gradient(#F2848F 0.5px, transparent 0.5px)',
              backgroundSize: '24px 24px'
            }}
          >
            {/* Elegant Corner Decorative Accents */}
            <div className="absolute top-3 left-3 w-12 h-12 border-t-4 border-l-4 border-[#C25492]" />
            <div className="absolute top-3 right-3 w-12 h-12 border-t-4 border-r-4 border-[#C25492]" />
            <div className="absolute bottom-3 left-3 w-12 h-12 border-b-4 border-l-4 border-[#C25492]" />
            <div className="absolute bottom-3 right-3 w-12 h-12 border-b-4 border-r-4 border-[#C25492]" />

            {/* Header / Logo */}
            <div className="flex flex-col items-center justify-center mb-6">
              <div className="w-16 h-16 rounded-full text-white flex items-center justify-center shadow-md mb-2 overflow-hidden">
                <img src="/assets/logo.jpeg" alt="IT-LeadHER" className="w-10 h-10 object-contain" />
              </div>
              <h2 className="text-2xl font-black text-[#212B36] tracking-tight uppercase">IT-LeadHER</h2>
              <p className="text-xs font-bold tracking-widest text-[#E63946] uppercase">
                International Women in Tech Organization
              </p>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-serif font-extrabold text-[#212B36] mb-2">
              CERTIFICAT DE PARTICIPATION
            </h1>
            <p className="text-sm font-light text-gray-600 uppercase tracking-widest mb-6">
              {language === 'fr' ? 'Ce certificat est décerné avec les félicitations du jury à :' : 'This certificate is proudly awarded to:'}
            </p>

            {/* Recipient Name */}
            <div className="inline-block border-b-2 border-[#E63946] pb-2 mb-6 px-8">
              <span className="text-3xl md:text-4xl font-serif font-bold text-[#B72430]">
                {selectedCertificate.userName}
              </span>
            </div>

            {/* Course completion text */}
            <p className="text-sm text-gray-700 max-w-xl mx-auto leading-relaxed mb-6">
              {language === 'fr'
                ? 'Pour avoir complété avec succès l\'ensemble des travaux pratiques, projets et évaluations du programme d\'excellence académique :'
                : 'For successfully completing all practical modules, projects, and assessments of the academic excellence program:'}
            </p>

            {/* Course Title */}
            <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 max-w-lg mx-auto mb-6 shadow-inner">
              <h3 className="text-xl font-bold text-[#212B36]">{selectedCertificate.courseTitle}</h3>
            </div>

            {/* Footer with Signatures and QR Code */}
            <div className="pt-6 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-6 text-left max-w-2xl mx-auto">
              <div>
                <p className="text-xs text-gray-500">{language === 'fr' ? 'Délivré le :' : 'Issued on:'}</p>
                <p className="text-sm font-semibold text-gray-800">{selectedCertificate.issueDate}</p>
                <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-700 font-medium">
                  <span>Ceci est un certificat de participation, prière ne pas l'utiliser à des fins professionnelles.</span>
                </div>
              </div>

              <div className="text-center md:text-right">
                <div className="font-serif italic text-lg text-gray-800 font-bold border-b border-gray-400 pb-1 mb-1">
                  Emma KOUSSONOU
                </div>
                <p className="text-xs text-gray-500 font-medium">Présidente IT-LeadHER</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};