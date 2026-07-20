import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient'; // Import your client here

export default function PDFManager() {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        fetchUserPDFs(user.id);
      }
    };
    getUser();
  }, []);

  const fetchUserPDFs = async (uid) => {
    const currentUid = uid || userId;
    if (!currentUid) return;
    const { data, error } = await supabase.storage.from('user files').list(currentUid);
    if (!error) setFiles(data || []);
  };

  const handleUpload = async (event) => {
    try {
      setUploading(true);
      const file = event.target.files[0];
      if (!file || file.type !== 'application/pdf') return alert('PDF files only.');
      
      const filePath = `${userId}/${Date.now()}_${file.name}`;
      const { error } = await supabase.storage.from('user files').upload(filePath, file);
      
      if (error) throw error;
      alert('Uploaded!');
      fetchUserPDFs();
    } catch (err) {
      alert(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleOpen = (fileName) => {
    const { data } = supabase.storage.from('user files').getPublicUrl(`${userId}/${fileName}`);
    window.open(data.publicUrl, '_blank');
  };

  const handleDelete = async (fileName) => {
    if (!window.confirm('Delete this PDF?')) return;
    const { error } = await supabase.storage.from('user files').remove([`${userId}/${fileName}`]);
    if (!error) fetchUserPDFs();
  };

  if (!userId) return <div className="p-6">Please log in.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-6">My Documents</h2>
      <div className="mb-6 p-4 border-2 border-dashed border-gray-300 rounded text-center">
        <label className="cursor-pointer">
          <span className="bg-blue-600 text-white px-4 py-2 rounded">{uploading ? 'Uploading...' : 'Upload PDF'}</span>
          <input type="file" accept=".pdf" className="hidden" onChange={handleUpload} disabled={uploading} />
        </label>
      </div>
      <div className="space-y-3">
        {files.map(file => (
          <div key={file.id} className="flex justify-between p-3 border rounded">
            <span>{file.name}</span>
            <div className="space-x-2">
              <button onClick={() => handleOpen(file.name)} className="bg-gray-200 px-3 py-1 rounded text-sm">Open</button>
              <button onClick={() => handleDelete(file.name)} className="bg-red-100 text-red-600 px-3 py-1 rounded text-sm">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
