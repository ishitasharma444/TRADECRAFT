import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { AuthService } from '../../services/auth';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { useNavigate } from 'react-router-dom';
import { Settings, ShieldAlert, Trash2, Volume2, Eye } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useGameStore();

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [mouseSensitivity, setMouseSensitivity] = useState(1.0);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'DELETE ACCOUNT') {
      setDeleteError('Please type "DELETE ACCOUNT" to confirm.');
      return;
    }

    setIsDeleting(true);
    setDeleteError(null);

    const result = await AuthService.deleteAccount(user?.id || 'demo');
    setIsDeleting(false);

    if (result.success) {
      await logout();
      navigate('/');
    } else {
      setDeleteError(result.error || 'Failed to delete account');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-wide">Application Settings</h1>
        <p className="text-xs text-slate-400">Configure account preferences, graphics controls, and data privacy.</p>
      </div>

      {/* Gameplay & Audio Settings */}
      <Card variant="border" className="space-y-4">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider font-mono">Gameplay & Accessibility</h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-slate-950 rounded-lg border border-slate-800">
            <div>
              <div className="text-xs font-bold text-white">Audio & Sound Effects</div>
              <div className="text-[11px] text-slate-400">Enable 3D world interaction and trading sound cues</div>
            </div>
            <input
              type="checkbox"
              checked={soundEnabled}
              onChange={(e) => setSoundEnabled(e.target.checked)}
              className="rounded text-emerald-500 bg-slate-900 border-slate-700"
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-950 rounded-lg border border-slate-800">
            <div>
              <div className="text-xs font-bold text-white">Reduced Motion</div>
              <div className="text-[11px] text-slate-400">Disable camera animations and smooth lerping</div>
            </div>
            <input
              type="checkbox"
              checked={reducedMotion}
              onChange={(e) => setReducedMotion(e.target.checked)}
              className="rounded text-emerald-500 bg-slate-900 border-slate-700"
            />
          </div>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-white">Mouse Sensitivity</span>
              <span className="font-mono text-emerald-400">{mouseSensitivity.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.5"
              step="0.1"
              value={mouseSensitivity}
              onChange={(e) => setMouseSensitivity(parseFloat(e.target.value))}
              className="w-full accent-emerald-500"
            />
          </div>
        </div>
      </Card>

      {/* Account Deletion Workflow (Section 39 of Prompt) */}
      <Card className="border-rose-500/30 bg-rose-950/20 space-y-4">
        <div className="flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-rose-300">Danger Zone - Account Deletion</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Permanently delete your TRADECRAFT profile, trade history, virtual portfolio, and level progress. This action is irreversible.
            </p>
          </div>
        </div>

        <Button
          variant="danger"
          size="sm"
          onClick={() => setIsDeleteModalOpen(true)}
        >
          <Trash2 className="w-4 h-4 mr-1" /> Delete Account & Purge Data
        </Button>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Account Deletion"
      >
        <div className="space-y-4">
          <p className="text-xs text-rose-300 leading-relaxed">
            Warning: You are about to permanently delete your account (<span className="font-bold">{user?.email}</span>). All virtual progress, XP, and holdings will be erased immediately.
          </p>

          <Input
            label='Type "DELETE ACCOUNT" to confirm:'
            placeholder="DELETE ACCOUNT"
            value={deleteConfirmation}
            onChange={(e) => setDeleteConfirmation(e.target.value)}
          />

          {deleteError && (
            <p className="text-xs text-rose-400">{deleteError}</p>
          )}

          <div className="flex items-center gap-3 pt-2">
            <Button
              variant="secondary"
              size="sm"
              className="w-full"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              className="w-full font-bold"
              isLoading={isDeleting}
              onClick={handleDeleteAccount}
            >
              Confirm Permanent Deletion
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
