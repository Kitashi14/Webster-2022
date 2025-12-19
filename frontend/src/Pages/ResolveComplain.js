import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AuthContext from '../context/auth-context'

const ResolveComplain = () => {
  const { cid } = useParams();
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const [details, setDetails] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [checkedAuth, setCheckedAuth] = useState(false);

  useEffect(()=>{
    const fetchDetails = async () => {
      try{
        const resp = await fetch(`${process.env.REACT_APP_SERVER_ROOT_URI}/api/complain/getDetails/${cid}`, { credentials: 'include' });
        const data = await resp.json();
        if(resp.status === 200){
          setDetails(data.data.complain);
          const currentUser = auth && auth.userName;
          const isAdmin = auth && auth.isAdmin;
          if (!isAdmin && (!currentUser || currentUser !== data.data.complain.creatorUsername)) {
            alert('You are not authorized to view this page');
            navigate('/');
            return;
          }
        } else {
          alert(data.error || 'Failed to load');
          navigate(-1);
        }
      } catch(err){
        console.log(err);
        alert('Failed to load complain');
        navigate(-1);
      } finally{
        setLoading(false);
        setCheckedAuth(true);
      }
    }
    fetchDetails();
  }, [cid, navigate, auth]);

  const submit = async () => {
    try{
      const resp = await fetch(`${process.env.REACT_APP_SERVER_ROOT_URI}/api/complain/close`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: cid, rating, comment })
      });
      const data = await resp.json();
      if(resp.status === 200){
        alert(data.message || 'Resolved');
        navigate(`/complain/${cid}`);
      } else {
        alert(data.error || 'Failed to resolve');
      }
    } catch(err){
      console.log(err);
      alert('Failed to resolve');
    }
  }

  if(loading) return <div className="p-6">Loading...</div>
  if(!details) return null

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Resolve Complain</h2>
      <div className="bg-white p-4 rounded shadow mb-4">
        <h3 className="font-medium">{details.title}</h3>
        <p className="text-sm text-slate-600">{details.description}</p>
      </div>

      <div className="bg-white p-4 rounded shadow space-y-4">
        <div>
          <label className="font-medium">Rating</label>
          <div className="flex items-center mt-2">
            {[1,2,3,4,5].map((s)=> (
              <svg key={s} onClick={() => setRating(s)} xmlns="http://www.w3.org/2000/svg" className={`h-7 w-7 cursor-pointer ${s <= rating ? 'text-blue-500' : 'text-gray-300'}`} viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.97c.3.92-.755 1.688-1.54 1.118l-3.386-2.46a1 1 0 00-1.176 0l-3.386 2.46c-.784.57-1.838-.197-1.539-1.118l1.287-3.97a1 1 0 00-.364-1.118L2.049 9.397c-.784-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.97z" />
              </svg>
            ))}
            <span className="ml-3 text-sm text-slate-600">{rating} / 5</span>
          </div>
        </div>

        <div>
          <label className="font-medium">Comment</label>
          <textarea value={comment} onChange={(e)=>setComment(e.target.value)} className="w-full border rounded p-2 mt-1" rows={5} />
        </div>

        <div className="flex justify-end gap-3">
          <button onClick={()=>navigate(-1)} className="px-4 py-2 border rounded">Cancel</button>
          <button onClick={submit} className="px-4 py-2 bg-blue-600 text-white rounded">Submit</button>
        </div>
      </div>
    </div>
  )
}

export default ResolveComplain
