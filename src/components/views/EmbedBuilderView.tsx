import React, { useState } from 'react';
import { ASSETS } from '../../data/assets';
import {
  Sparkles,
  Copy,
  Check,
  Plus,
  Trash2,
  Download,
  Eye,
  FileCode
} from 'lucide-react';

interface EmbedField {
  name: string;
  value: string;
  inline: boolean;
}

export const EmbedBuilderView: React.FC = () => {
  const [title, setTitle] = useState('Silence Designs | Official Announcement');
  const [description, setDescription] = useState('We are excited to unveil our newly configured ER:LC fleet livery pack and custom tactical uniform lines for all verified communities.');
  const [color, setColor] = useState('#2563EB');
  const [authorName, setAuthorName] = useState('Silence Designs Team');
  const [authorIcon, setAuthorIcon] = useState(ASSETS.logo);
  const [thumbnailUrl, setThumbnailUrl] = useState(ASSETS.logo);
  const [imageUrl, setImageUrl] = useState(ASSETS.liveryBanner);
  const [footerText, setFooterText] = useState('Silence Designs • Master Service Agreement Applies');
  const [fields, setFields] = useState<EmbedField[]>([
    { name: 'Featured Release', value: '2023 Stealth Highway Patrol Cruiser', inline: true },
    { name: 'Turnaround', value: 'Instant Download ZIP', inline: true }
  ]);
  const [copied, setCopied] = useState(false);

  const addField = () => {
    setFields([...fields, { name: 'New Field', value: 'Field value details', inline: true }]);
  };

  const removeField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const updateField = (index: number, key: keyof EmbedField, val: any) => {
    setFields(fields.map((f, i) => i === index ? { ...f, [key]: val } : f));
  };

  const applyTemplate = (type: 'ad' | 'release' | 'announcement') => {
    if (type === 'ad') {
      setTitle('Tri-County Highway Patrol | SFW ER:LC Community');
      setDescription('This is a paid advertisement. This server is not affiliated with Silence Designs.\n\nJoin our premier realistic law enforcement roleplay collective! Daily patrols, active dispatch, custom vehicle assets.');
      setColor('#E11D48');
      setImageUrl(ASSETS.clothingBanner);
      setFields([
        { name: 'Prize Promotion', value: '1 Month Discord Nitro Giveaway inside', inline: true },
        { name: 'Invite Link', value: 'https://discord.gg/example-ad', inline: true }
      ]);
    } else if (type === 'release') {
      setTitle('Free Release | Chicago Police FPIU (2020)');
      setDescription('This resource is completely free for everyone! You are more than welcome to use it, customize the files to fit your needs, and utilize it across any of your own projects. Enjoy!\n\n**Included Item(s):**\n• Chicago Police FPIU (2020)\n\n**Credits:** Carlos473\n**Ping:** @Releases');
      setColor('#16A34A');
      setImageUrl(ASSETS.liveryBanner);
      setFields([
        { name: 'License', value: 'Open Studio License', inline: true },
        { name: 'Format', value: 'ZIP Archive Attached', inline: true }
      ]);
    } else {
      setTitle('Silence Designs | Official Announcement');
      setDescription('Orders for vehicle liveries and uniforms are resuming with our updated designer roster!');
      setColor('#2563EB');
      setImageUrl(ASSETS.liveryBanner);
    }
  };

  const exportJson = () => {
    const embedData = {
      title,
      description,
      color: parseInt(color.replace('#', ''), 16),
      author: authorName ? { name: authorName, icon_url: authorIcon } : undefined,
      thumbnail: thumbnailUrl ? { url: thumbnailUrl } : undefined,
      image: imageUrl ? { url: imageUrl } : undefined,
      footer: footerText ? { text: footerText } : undefined,
      fields: fields.map(f => ({ name: f.name, value: f.value, inline: f.inline }))
    };

    navigator.clipboard.writeText(JSON.stringify(embedData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#111622] border border-[#232D3F] p-5 rounded-xl">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-400" />
            Discord Visual Embed Builder (/botsay)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Construct rich Discord application embeds with real-time WYSIWYG rendering and JSON export.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => applyTemplate('ad')}
            className="px-2.5 py-1.5 bg-[#0B0E14] hover:bg-[#161D2D] text-slate-300 border border-[#232D3F] rounded text-xs"
          >
            Ad Template
          </button>
          <button
            onClick={() => applyTemplate('release')}
            className="px-2.5 py-1.5 bg-[#0B0E14] hover:bg-[#161D2D] text-slate-300 border border-[#232D3F] rounded text-xs"
          >
            Release Template
          </button>
          <button
            onClick={exportJson}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-semibold flex items-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied JSON!' : 'Copy Discord JSON'}
          </button>
        </div>
      </div>

      {/* Two Column Builder */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Editor Form */}
        <div className="lg:col-span-6 bg-[#111622] border border-[#232D3F] rounded-xl p-5 space-y-4 text-xs">
          <h3 className="text-sm font-bold text-white">Embed Properties</h3>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Embed Title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-[#0B0E14] border border-[#232D3F] rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Description (Markdown Supported)</label>
            <textarea
              rows={4}
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full bg-[#0B0E14] border border-[#232D3F] rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Accent Border Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={color}
                  onChange={e => setColor(e.target.value)}
                  className="w-8 h-8 rounded border border-[#232D3F] bg-transparent cursor-pointer"
                />
                <input
                  type="text"
                  value={color}
                  onChange={e => setColor(e.target.value)}
                  className="w-full bg-[#0B0E14] border border-[#232D3F] rounded px-2.5 py-1 text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Author Name</label>
              <input
                type="text"
                value={authorName}
                onChange={e => setAuthorName(e.target.value)}
                className="w-full bg-[#0B0E14] border border-[#232D3F] rounded px-3 py-1.5 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Thumbnail URL</label>
              <input
                type="text"
                value={thumbnailUrl}
                onChange={e => setThumbnailUrl(e.target.value)}
                className="w-full bg-[#0B0E14] border border-[#232D3F] rounded px-2.5 py-1.5 text-white text-[11px]"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Banner Image URL</label>
              <input
                type="text"
                value={imageUrl}
                onChange={e => setImageUrl(e.target.value)}
                className="w-full bg-[#0B0E14] border border-[#232D3F] rounded px-2.5 py-1.5 text-white text-[11px]"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Footer Text</label>
            <input
              type="text"
              value={footerText}
              onChange={e => setFooterText(e.target.value)}
              className="w-full bg-[#0B0E14] border border-[#232D3F] rounded px-3 py-1.5 text-white"
            />
          </div>

          {/* Fields List */}
          <div className="pt-2 border-t border-[#1f2838] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-300">Embed Fields ({fields.length})</span>
              <button
                type="button"
                onClick={addField}
                className="text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold"
              >
                <Plus className="w-3.5 h-3.5" /> Add Field
              </button>
            </div>

            {fields.map((f, i) => (
              <div key={i} className="bg-[#0B0E14] border border-[#1f2838] p-3 rounded-lg space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <input
                    type="text"
                    value={f.name}
                    onChange={e => updateField(i, 'name', e.target.value)}
                    placeholder="Field name"
                    className="w-1/2 bg-[#161D2D] border border-[#232D3F] rounded px-2 py-1 text-white text-xs"
                  />
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1 text-[11px] text-slate-400 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={f.inline}
                        onChange={e => updateField(i, 'inline', e.target.checked)}
                      />
                      Inline
                    </label>
                    <button
                      onClick={() => removeField(i)}
                      className="text-slate-500 hover:text-rose-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <input
                  type="text"
                  value={f.value}
                  onChange={e => updateField(i, 'value', e.target.value)}
                  placeholder="Field value"
                  className="w-full bg-[#161D2D] border border-[#232D3F] rounded px-2 py-1 text-white text-xs"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Live Discord Canvas Preview */}
        <div className="lg:col-span-6 bg-[#0B0E14] border border-[#232D3F] rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-[#1f2838]">
            <span className="flex items-center gap-1.5 font-semibold text-slate-200">
              <Eye className="w-4 h-4 text-blue-400" />
              Live Discord Client Embed Preview
            </span>
            <span className="font-mono text-[11px]">#announcements</span>
          </div>

          <div
            className="rounded-lg bg-[#111622] p-4 text-xs border border-[#232D3F] border-l-4 shadow-xl"
            style={{ borderLeftColor: color }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2 flex-1">
                {authorName && (
                  <div className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
                    {authorIcon && (
                      <img
                        src={authorIcon}
                        alt="Author"
                        className="w-4 h-4 rounded-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    )}
                    <span>{authorName}</span>
                  </div>
                )}

                <h4 className="text-sm font-bold text-white tracking-tight">{title}</h4>
                <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">{description}</p>
              </div>

              {thumbnailUrl && (
                <img
                  src={thumbnailUrl}
                  alt="Thumbnail"
                  className="w-16 h-16 rounded object-cover border border-[#232D3F] shrink-0"
                  referrerPolicy="no-referrer"
                />
              )}
            </div>

            {fields.length > 0 && (
              <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-[#1f2838]">
                {fields.map((f, i) => (
                  <div key={i} className={f.inline ? '' : 'col-span-2'}>
                    <div className="font-semibold text-slate-200">{f.name}</div>
                    <div className="text-slate-400 mt-0.5 whitespace-pre-wrap">{f.value}</div>
                  </div>
                ))}
              </div>
            )}

            {imageUrl && (
              <img
                src={imageUrl}
                alt="Banner"
                className="w-full h-44 object-cover rounded mt-3 border border-[#232D3F]"
                referrerPolicy="no-referrer"
              />
            )}

            {footerText && (
              <div className="mt-3 pt-2 text-[11px] text-slate-400 border-t border-[#1f2838]">
                {footerText}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
