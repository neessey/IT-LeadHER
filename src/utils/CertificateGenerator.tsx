// utils/CertificateGenerator.ts
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface CertificateData {
  id: string;
  userName: string;
  courseTitle: string;
  issueDate: string;
  certificateCode: string;
  skills?: string[];
}


export const generateCertificateHTML = (cert: CertificateData): string => {
  return `
    <div style="width:800px;height:566px;padding:35px 40px;background:white;font-family:Arial,sans-serif;text-align:center;border:8px double #B72430;position:relative;overflow:hidden;background-image:radial-gradient(#F2848F 0.5px, transparent 0.5px);background-size:24px 24px;">
      
      <!-- Corner Decorative Accents -->
      <div style="position:absolute;top:12px;left:12px;width:48px;height:48px;border-top:4px solid #C25492;border-left:4px solid #C25492;"></div>
      <div style="position:absolute;top:12px;right:12px;width:48px;height:48px;border-top:4px solid #C25492;border-right:4px solid #C25492;"></div>
      <div style="position:absolute;bottom:12px;left:12px;width:48px;height:48px;border-bottom:4px solid #C25492;border-left:4px solid #C25492;"></div>
      <div style="position:absolute;bottom:12px;right:12px;width:48px;height:48px;border-bottom:4px solid #C25492;border-right:4px solid #C25492;"></div>

      <!-- Header / Logo - sans rond autour -->
      <div style="margin-bottom:12px;display:flex;flex-direction:column;align-items:center;">
        <img src="/assets/logo.jpeg" alt="IT-LeadHER" style="width:60px;height:60px;border-radius:30%;object-fit:cover;margin-bottom:6px;" />
        <h2 style="font-size:22px;font-weight:900;color:#212B36;margin:4px 0 0;letter-spacing:0;text-transform:uppercase;">IT-LeadHER</h2>
        <p style="font-size:9px;font-weight:bold;color:#E63946;letter-spacing:2px;text-transform:uppercase;margin:2px 0 0;">
          International Women in Tech Organization
        </p>
      </div>

      <!-- Title -->
      <h1 style="font-size:28px;font-weight:900;color:#212B36;margin-bottom:4px;font-family:Georgia,serif;">
        CERTIFICAT DE RÉUSSITE
      </h1>
      <p style="font-size:10px;color:#666;text-transform:uppercase;letter-spacing:2px;margin-bottom:12px;">
        Ce certificat est décerné avec les félicitations du jury à :
      </p>

      <!-- Recipient Name -->
      <div style="display:inline-block;border-bottom:2px solid #E63946;padding:0 30px 6px;margin-bottom:12px;">
        <span style="font-size:32px;font-weight:bold;color:#B72430;font-family:Georgia,serif;">
          ${cert.userName}
        </span>
      </div>

      <!-- Course completion text -->
      <p style="font-size:11px;color:#555;max-width:500px;margin:0 auto 12px;line-height:1.5;">
        Pour avoir complété avec succès l'ensemble des travaux pratiques, projets et évaluations du programme d'excellence académique :
      </p>

      <!-- Course Title -->
      <div style="background:#FEF2F2;border:1px solid #FECACA;border-radius:12px;padding:8px 20px;max-width:450px;margin:0 auto 14px;box-shadow:inset 0 1px 4px rgba(0,0,0,0.04);">
        <h3 style="font-size:16px;font-weight:bold;color:#212B36;margin:0;">${cert.courseTitle}</h3>
      </div>

      <!-- Footer - remonté -->
      <div style="display:flex;justify-content:space-between;align-items:center;max-width:550px;margin:0 auto;padding-top:12px;border-top:1px solid #E5E7EB;">
        <div style="text-align:left;">
          <p style="font-size:8px;color:#999;margin:0;text-transform:uppercase;letter-spacing:1px;">Délivré le :</p>
          <p style="font-size:12px;font-weight:bold;color:#333;margin:2px 0 0;">${cert.issueDate}</p>
          <div style="display:flex;align-items:center;gap:4px;margin-top:4px;">
            <span style="font-size:10px;color:#059669;font-weight:bold;">🔒</span>
            <span style="font-size:9px;color:#059669;font-weight:bold;">Code : ${cert.certificateCode}</span>
          </div>
        </div>
        
        <div style="text-align:right;">
          <div style="font-size:16px;font-weight:bold;color:#333;font-family:Georgia,serif;font-style:italic;border-bottom:1px solid #999;padding-bottom:3px;margin-bottom:2px;">
            Emma KOUSSONOU
          </div>
          <p style="font-size:8px;color:#999;margin:0;font-weight:500;">Présidente IT-LeadHER</p>
        </div>
      </div>

    </div>
  `;
};

export const downloadCertificate = async (cert: CertificateData): Promise<boolean> => {
  try {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = generateCertificateHTML(cert);
    
    // S'assurer que le div est visible pour html2canvas
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.top = '0';
    tempDiv.style.zIndex = '9999';
    
    document.body.appendChild(tempDiv);

    // Attendre un peu pour que les images chargent
    await new Promise(resolve => setTimeout(resolve, 500));

    const canvas = await html2canvas(tempDiv, {
      scale: 3,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      width: 800,
      height: 566,
      onclone: (clonedDoc) => {
        // S'assurer que les images sont chargées
        const images = clonedDoc.querySelectorAll('img');
        return Promise.all(Array.from(images).map(img => {
          if (img.complete) return Promise.resolve();
          return new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
          });
        }));
      }
    });

    document.body.removeChild(tempDiv);

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, pageHeight, undefined, 'FAST');
    pdf.save(`Certificat-${cert.userName.replace(/\s+/g, '_')}.pdf`);

    return true;
  } catch (error) {
    console.error('Erreur lors du téléchargement:', error);
    return false;
  }
};