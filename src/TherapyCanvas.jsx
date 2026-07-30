import React, { useState, useEffect } from 'react';
import { Stage, Layer, Image as KonvaImage } from 'react-konva';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient('SUA_SUPABASE_URL', 'SUA_SUPABASE_ANON_KEY');

export default function TherapyCanvas({ roomId }) {
  const [objects, setObjects] = useState([]);

  useEffect(() => {
    fetchRoomState();
    const channel = supabase
      .channel(`room:${roomId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'rooms', filter: `id=eq.${roomId}` },
        (payload) => {
          if (payload.new && payload.new.canvas_state) {
            setObjects(payload.new.canvas_state);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId]);

  const fetchRoomState = async () => {
    const { data } = await supabase
      .from('rooms')
      .select('canvas_state')
      .eq('id', roomId)
      .single();
    
    if (data && data.canvas_state) {
      setObjects(data.canvas_state);
    }
  };

  const handleDragEnd = async (e, id) => {
    const x = e.target.x();
    const y = e.target.y();

    const updatedObjects = objects.map((obj) => 
      obj.id === id ? { ...obj, x, y } : obj
    );

    setObjects(updatedObjects);

    await supabase
      .from('rooms')
      .update({ canvas_state: updatedObjects })
      .eq('id', roomId);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h2 className="text-lg font-semibold mb-2">Sand Tray Interativo (Tempo Real)</h2>
      <div className="border-2 border-dashed border-sky-400 bg-white rounded-lg overflow-hidden shadow-md">
        <Stage width={600} height={400}>
          <Layer>
            {objects.map((item) => (
              <KonvaImage
                key={item.id}
                x={item.x}
                y={item.y}
                image={item.imageObj}
                draggable
                onDragEnd={(e) => handleDragEnd(e, item.id)}
                width={60}
                height={60}
              />
            ))}
          </Layer>
        </Stage>
      </div>
    </div>
  );
}
