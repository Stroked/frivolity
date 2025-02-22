import { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from './supabaseClient';
import Avatar from './Avatar';

interface Profile {
  username: string | null;
  website: string | null;
  avatar_url: string | null;
}

interface AccountProps {
  session: Session;
}

export default function Account({ session }: AccountProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const [username, setUsername] = useState<string | null>(null);
  const [website, setWebsite] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    async function getProfile() {
      try {
        setLoading(true);
        const { user } = session;

        const { data, error } = await supabase
          .from('profiles')
          .select('username, website, avatar_url')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        if (!data) throw new Error('No profile data found');

        setUsername(data.username);
        setWebsite(data.website);
        setAvatarUrl(data.avatar_url);
      } catch (error) {
        console.warn(error);
      } finally {
        setLoading(false);
      }
    }

    getProfile();
  }, [session]);

  async function updateProfile({ username, website, avatar_url }: Profile) {
    try {
      setLoading(true);
      const { user } = session;

      const updates = {
        id: user.id,
        username,
        website,
        avatar_url,
        updated_at: new Date(),
      };

      const { error } = await supabase.from('profiles').upsert(updates);
      if (error) throw error;
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="form-widget">
      <Avatar
        url={avatarUrl}
        size={150}
        onUpload={(url: string) => {
          setAvatarUrl(url);
          updateProfile({ username, website, avatar_url: url });
        }}
      />
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="text" value={session.user.email} disabled />
      </div>
      <div>
        <label htmlFor="username">Name</label>
        <input
          id="username"
          type="text"
          value={username || ''}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="website">Website</label>
        <input
          id="website"
          type="text"
          value={website || ''}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      <div>
        <button
          className="button block primary"
          onClick={() => updateProfile({ username, website, avatar_url: avatarUrl })}
          disabled={loading}
        >
          {loading ? 'Loading ...' : 'Update'}
        </button>
      </div>

      <div>
        <button className="button block" onClick={() => supabase.auth.signOut()}>
          Sign Out
        </button>
      </div>
    </div>
  );
}
