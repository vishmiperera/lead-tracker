"use client";

import React, { useState } from "react";
import { X, Users, UserPlus, Trash2, Edit2, Check, AlertCircle } from "lucide-react";
import { Lead } from "@/types";

interface ManageAssigneesModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignees: string[];
  leads: Lead[];
  onAddAssignee: (name: string) => void;
  onUpdateAssignee: (oldName: string, newName: string) => void;
  onDeleteAssignee: (name: string) => void;
}

export function ManageAssigneesModal({
  isOpen,
  onClose,
  assignees,
  leads,
  onAddAssignee,
  onUpdateAssignee,
  onDeleteAssignee,
}: ManageAssigneesModalProps) {
  const [newAssigneeName, setNewAssigneeName] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    const trimmed = newAssigneeName.trim();
    if (!trimmed) return;

    if (assignees.some((a) => a.toLowerCase() === trimmed.toLowerCase())) {
      setErrorMsg(`"${trimmed}" already exists in the assignees list.`);
      return;
    }

    onAddAssignee(trimmed);
    setNewAssigneeName("");
  };

  const startEdit = (index: number, name: string) => {
    setEditingIndex(index);
    setEditingValue(name);
    setErrorMsg("");
  };

  const handleSaveEdit = (oldName: string) => {
    setErrorMsg("");
    const trimmed = editingValue.trim();
    if (!trimmed || trimmed === oldName) {
      setEditingIndex(null);
      return;
    }

    if (
      assignees.some(
        (a) => a.toLowerCase() === trimmed.toLowerCase() && a.toLowerCase() !== oldName.toLowerCase()
      )
    ) {
      setErrorMsg(`"${trimmed}" already exists in the assignees list.`);
      return;
    }

    onUpdateAssignee(oldName, trimmed);
    setEditingIndex(null);
  };

  const handleDelete = (name: string) => {
    const count = leads.filter((l) => l.assignee === name).length;
    const confirmText =
      count > 0
        ? `"${name}" currently has ${count} lead(s) assigned. Are you sure you want to remove them? Those leads will become unassigned.`
        : `Are you sure you want to remove "${name}" from assignees?`;

    if (confirm(confirmText)) {
      onDeleteAssignee(name);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#2EA3E6]/10 text-[#2EA3E6] flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Manage Team Assignees
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Configure team members available in the Assignee column
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Add New Assignee Form */}
          <form onSubmit={handleAdd} className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Add New Team Member
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. Kasun Perera"
                value={newAssigneeName}
                onChange={(e) => setNewAssigneeName(e.target.value)}
                className="flex-1 px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2EA3E6]"
              />
              <button
                type="submit"
                disabled={!newAssigneeName.trim()}
                className="px-4 py-2.5 bg-[#2EA3E6] hover:bg-[#258bc5] disabled:opacity-50 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-[#2EA3E6]/25 transition shrink-0"
              >
                <UserPlus className="w-4 h-4" />
                <span>Add</span>
              </button>
            </div>
          </form>

          {errorMsg && (
            <div className="flex items-center gap-2 p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-xs rounded-xl">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Assignees List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Current Assignees ({assignees.length})
              </label>
              <span className="text-[11px] text-slate-400">
                Click any lead row to assign
              </span>
            </div>

            <div className="space-y-2">
              {assignees.map((person, index) => {
                const assignedCount = leads.filter((l) => l.assignee === person).length;
                const isEditing = editingIndex === index;

                return (
                  <div
                    key={person}
                    className="flex items-center justify-between p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700 transition"
                  >
                    <div className="flex items-center space-x-3 flex-1 mr-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#2EA3E6] to-[#00A3E8] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                        {person.charAt(0).toUpperCase()}
                      </div>

                      {isEditing ? (
                        <div className="flex items-center gap-1.5 flex-1">
                          <input
                            type="text"
                            value={editingValue}
                            onChange={(e) => setEditingValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleSaveEdit(person);
                              if (e.key === "Escape") setEditingIndex(null);
                            }}
                            autoFocus
                            className="flex-1 px-2.5 py-1 text-sm bg-white dark:bg-slate-900 border border-[#2EA3E6] rounded-lg focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveEdit(person)}
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-lg"
                            title="Save"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div>
                          <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                            {person}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {assignedCount === 1
                              ? "1 lead assigned"
                              : `${assignedCount} leads assigned`}
                          </div>
                        </div>
                      )}
                    </div>

                    {!isEditing && (
                      <div className="flex items-center space-x-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => startEdit(index, person)}
                          className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
                          title="Rename Assignee"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(person)}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition"
                          title="Remove Assignee"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}

              {assignees.length === 0 && (
                <div className="p-6 text-center text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                  No assignees defined. Add one above.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/30 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold rounded-full bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 hover:opacity-90 transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

