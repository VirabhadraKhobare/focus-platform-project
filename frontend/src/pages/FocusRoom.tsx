import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../hooks/useAuth';

const SOCKET_URL = 'http://localhost:4000';

export default function FocusRoom(){
  const { user } = useAuth();
  const [connected, setConnected] = useState(false);
  const [participants, setParticipants] = useState<any[]>([]);
  const socketRef = useRef<any>(null);
  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState(25*60); // default 25 min

  useEffect(()=>{
    const s = io(SOCKET_URL);
    socketRef.current = s;
    s.on('connect', ()=> setConnected(true));
    s.on('presence', (p:any)=> {
      // naive presence handling
      setParticipants(prev => [...prev, p]);
    });
    s.on('session-started', (d:any)=> console.log('started', d));
    s.on('session-ended', (d:any)=> console.log('ended', d));
    return ()=> { s.disconnect(); };
  },[]);

  useEffect(()=>{
    let t:any;
    if(running){
      t = setInterval(()=> setSeconds(s=> s-1), 1000);
    }
    return ()=> clearInterval(t);
  },[running]);

  function join(){
    socketRef.current.emit('join-room', { roomId: 'global', userId: user?.id });
  }
  function leave(){
    socketRef.current.emit('leave-room', { roomId: 'global', userId: user?.id });
  }
  function startSession(){
    const startTime = new Date().toISOString();
    socketRef.current.emit('start-session', { roomId: 'global', userId: user?.id, startTime });
    setRunning(true);
  }
  function endSession(){
    const endTime = new Date().toISOString();
    socketRef.current.emit('end-session', { roomId: 'global', userId: user?.id, startTime: new Date(Date.now()-seconds*1000).toISOString(), endTime });
    setRunning(false);
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Focus Room</h1>
          <div>{connected? 'Connected':'Offline'}</div>
        </header>

        <div className="mt-6 glass rounded p-6">
          <div className="flex gap-4 items-center">
            <button onClick={join} className="px-4 py-2 rounded bg-white/5">Join Room</button>
            <button onClick={leave} className="px-4 py-2 rounded border">Leave</button>
            <button onClick={startSession} disabled={running} className="px-4 py-2 rounded bg-gradient-to-r from-violet-600 to-cyan-400">Start</button>
            <button onClick={endSession} disabled={!running} className="px-4 py-2 rounded border">End</button>
            <div className="ml-auto">{Math.floor(seconds/60)}:{String(seconds%60).padStart(2,'0')}</div>
          </div>

          <div className="mt-4">
            <h3 className="font-semibold">Participants</h3>
            <ul className="mt-2">
              {participants.map((p,i)=> <li key={i}>{JSON.stringify(p)}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
