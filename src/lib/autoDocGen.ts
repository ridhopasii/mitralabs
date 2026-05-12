import { supabase } from './supabase';

export async function generateAndUploadDocs(bookingId: number, bookingData: any) {
  try {
    console.log('🚀 Starting Auto Doc Gen for Booking #', bookingId);
    
    // 1. Load jsPDF dynamically
    const { jsPDF } = await import('jspdf');
    
    // Helper to generate Proposal Blob
    const generateProposalBlob = () => {
      const pdf = new jsPDF('p', 'mm', 'a4');
      pdf.setFontSize(22);
      pdf.text('PROJECT PROPOSAL', 20, 30);
      pdf.setFontSize(12);
      pdf.text(`Prepared for: ${bookingData.customer_name}`, 20, 50);
      pdf.text(`Service: ${bookingData.service_type}`, 20, 60);
      pdf.text(`Plan: ${bookingData.plan_name}`, 20, 70);
      pdf.text(`Investment: Rp ${bookingData.total_price.toLocaleString()}`, 20, 80);
      pdf.text('Brief:', 20, 100);
      const lines = pdf.splitTextToSize(bookingData.project_brief || '', 170);
      pdf.text(lines, 20, 110);
      return pdf.output('blob');
    };

    // Helper to generate SPK Blob
    const generateSPKBlob = () => {
      const pdf = new jsPDF('p', 'mm', 'a4');
      pdf.setFontSize(22);
      pdf.text('SURAT PERINTAH KERJA', 20, 30);
      pdf.setFontSize(12);
      pdf.text(`Pihak Pertama: Mitralabs Agency`, 20, 50);
      pdf.text(`Pihak Kedua: ${bookingData.customer_name}`, 20, 60);
      pdf.text(`Lingkup: ${bookingData.service_type}`, 20, 70);
      pdf.text(`Nilai: Rp ${bookingData.total_price.toLocaleString()}`, 20, 80);
      pdf.text('Dihasilkan secara otomatis sebagai bukti kesepakatan digital.', 20, 100);
      return pdf.output('blob');
    };

    const proposalBlob = generateProposalBlob();
    const spkBlob = generateSPKBlob();

    // 2. Upload to Supabase Storage
    const proposalPath = `documents/proposal-${bookingId}-${Date.now()}.pdf`;
    const spkPath = `documents/spk-${bookingId}-${Date.now()}.pdf`;

    const [proposalUpload, spkUpload] = await Promise.all([
      supabase.storage.from('site-assets').upload(proposalPath, proposalBlob, { contentType: 'application/pdf' }),
      supabase.storage.from('site-assets').upload(spkPath, spkBlob, { contentType: 'application/pdf' })
    ]);

    if (proposalUpload.error) throw proposalUpload.error;
    if (spkUpload.error) throw spkUpload.error;

    // 3. Get Public URLs
    const { data: { publicUrl: proposalUrl } } = supabase.storage.from('site-assets').getPublicUrl(proposalPath);
    const { data: { publicUrl: spkUrl } } = supabase.storage.from('site-assets').getPublicUrl(spkPath);

    // 4. Update Booking Record
    const { error: updateError } = await supabase
      .from('Booking')
      .update({
        proposal_url: proposalUrl,
        spk_url: spkUrl
      })
      .eq('id', bookingId);

    if (updateError) throw updateError;

    console.log('✅ Auto Doc Gen complete for Booking #', bookingId);
    return { proposalUrl, spkUrl };
  } catch (err) {
    console.error('❌ Auto Doc Gen failed:', err);
    return null;
  }
}
