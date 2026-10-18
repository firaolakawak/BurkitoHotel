import React, { useState } from 'react';
import { PRISMA_SCHEMA_CONTENT } from '../../schema/prisma.schema.ts';
import { POSTGRES_DDL_CONTENT } from '../../schema/postgres.ddl.ts';
import { ARCHITECTURE_OVERVIEW } from '../../schema/architecture.ts';
import {
  Database,
  Code2,
  GitBranch,
  Copy,
  Check,
  Download,
  FolderTree
} from 'lucide-react';

export const ArchitectureViewer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ARCHITECTURE' | 'PRISMA' | 'POSTGRES' | 'ERD'>('ARCHITECTURE');
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (content: string, key: string) => {
    navigator.clipboard.writeText(content);
    setCopied(key);
    setTimeout(() => setCopied(null), 3000);
  };

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                Aurelia Engineering Suite
              </span>
              <span className="text-xs text-slate-400 font-mono">v{ARCHITECTURE_OVERVIEW.version}</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mt-1">{ARCHITECTURE_OVERVIEW.title}</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Production-ready PostgreSQL DDL, Prisma relational schema, and ER model architecture.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'ARCHITECTURE', label: 'Folder Layout', icon: FolderTree },
              { id: 'PRISMA', label: 'Prisma Schema', icon: Code2 },
              { id: 'POSTGRES', label: 'PostgreSQL DDL', icon: Database },
              { id: 'ERD', label: 'ER Diagram', icon: GitBranch }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tabs */}
      {activeTab === 'ARCHITECTURE' && (
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">System Folder Tree</h3>
            <button
              onClick={() => handleCopy(ARCHITECTURE_OVERVIEW.folderStructure, 'folders')}
              className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-semibold"
            >
              {copied === 'folders' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Copy</span>
            </button>
          </div>
          <pre className="p-4 rounded-xl bg-slate-900 text-slate-100 text-xs font-mono overflow-x-auto">
            {ARCHITECTURE_OVERVIEW.folderStructure}
          </pre>
        </div>
      )}

      {activeTab === 'PRISMA' && (
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">schema.prisma (PostgreSQL)</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => downloadFile(PRISMA_SCHEMA_CONTENT, 'schema.prisma', 'text/plain')}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-xs font-semibold flex items-center gap-1"
              >
                <Download className="w-3 h-3" /> Download
              </button>
              <button
                onClick={() => handleCopy(PRISMA_SCHEMA_CONTENT, 'prisma')}
                className="px-2.5 py-1 bg-[#2563EB] text-white rounded-md text-xs font-semibold flex items-center gap-1"
              >
                {copied === 'prisma' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />} Copy
              </button>
            </div>
          </div>
          <pre className="p-4 rounded-xl bg-slate-900 text-emerald-300 text-xs font-mono overflow-x-auto max-h-[500px]">
            {PRISMA_SCHEMA_CONTENT}
          </pre>
        </div>
      )}

      {activeTab === 'POSTGRES' && (
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">init_schema.sql (PostgreSQL DDL)</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => downloadFile(POSTGRES_DDL_CONTENT, 'schema.sql', 'text/sql')}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-xs font-semibold flex items-center gap-1"
              >
                <Download className="w-3 h-3" /> Download
              </button>
              <button
                onClick={() => handleCopy(POSTGRES_DDL_CONTENT, 'postgres')}
                className="px-2.5 py-1 bg-[#2563EB] text-white rounded-md text-xs font-semibold flex items-center gap-1"
              >
                {copied === 'postgres' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />} Copy
              </button>
            </div>
          </div>
          <pre className="p-4 rounded-xl bg-slate-900 text-sky-300 text-xs font-mono overflow-x-auto max-h-[500px]">
            {POSTGRES_DDL_CONTENT}
          </pre>
        </div>
      )}

      {activeTab === 'ERD' && (
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Relational Architecture</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="font-bold text-slate-900">PMS Core Domain</div>
              <p className="text-slate-500 text-[11px]">Rooms, Guests, Bookings with relational 1:N foreign keys.</p>
            </div>
            <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl space-y-2 text-blue-900">
              <div className="font-bold">Accounting & Folio Bridge</div>
              <p className="text-[11px] text-blue-700">Folios, items, payments, and InventoryConsumption bridge.</p>
            </div>
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="font-bold text-slate-900">Multi-Location IMS Domain</div>
              <p className="text-slate-500 text-[11px]">Central Warehouse, Floor Closets, Purchase Orders & Transfers.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
