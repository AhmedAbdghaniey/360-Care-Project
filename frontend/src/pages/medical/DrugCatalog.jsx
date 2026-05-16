import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiSearch, FiPlus, FiEdit2, FiTrash2, FiPackage,
  FiAlertCircle, FiSave, FiX,
} from 'react-icons/fi'
import toast from 'react-hot-toast'
import { useDrugs, useCreateDrug, useUpdateDrug, useDeleteDrug } from '../../hooks/useDrugs'
import LoadingSkeleton from '../../components/ui/LoadingSkeleton'
import EmptyState from '../../components/ui/EmptyState'
import DataCard from '../../components/ui/DataCard'
import Modal from '../../components/ui/Modal'

export default function DrugCatalog() {
  const { data: drugsData, isLoading, error } = useDrugs()
  const createDrug = useCreateDrug()
  const updateDrug = useUpdateDrug()
  const deleteDrug = useDeleteDrug()

  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingDrug, setEditingDrug] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [formName, setFormName] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const drugs = useMemo(() => {
    const list = Array.isArray(drugsData) ? drugsData : drugsData?.data || []
    if (!search.trim()) return list.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
    const q = search.toLowerCase()
    return list.filter((d) => (d.name || '').toLowerCase().includes(q) || (d.description || '').toLowerCase().includes(q))
      .sort((a, b) => (a.name || '').localeCompare(b.name || ''))
  }, [drugsData, search])

  const openAddModal = () => {
    setEditingDrug(null)
    setFormName('')
    setFormDescription('')
    setShowModal(true)
  }

  const openEditModal = (drug) => {
    setEditingDrug(drug)
    setFormName(drug.name || '')
    setFormDescription(drug.description || '')
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formName.trim()) {
      toast.error('Drug name is required')
      return
    }
    setSubmitting(true)
    try {
      const payload = { name: formName.trim(), description: formDescription.trim() }
      if (editingDrug) {
        await updateDrug.mutateAsync({ id: editingDrug._id || editingDrug.id, data: payload })
        toast.success('Drug updated')
      } else {
        await createDrug.mutateAsync(payload)
        toast.success('Drug added')
      }
      setShowModal(false)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save drug')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (drug) => {
    try {
      await deleteDrug.mutateAsync(drug._id || drug.id)
      toast.success('Drug deleted')
      setDeleteConfirm(null)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete drug')
    }
  }

  if (isLoading) return <div className="space-y-4"><LoadingSkeleton type="list" count={5} /></div>
  if (error) return <EmptyState icon={FiAlertCircle} title="Failed to load drugs" description={error.message} />

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Drug Catalog</h1>
          <p className="text-sm text-gray-400">Manage available medications and drugs</p>
        </div>
        <button onClick={openAddModal} className="btn-primary flex items-center gap-2 self-start">
          <FiPlus className="h-4 w-4" /> Add Drug
        </button>
      </div>

      <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
        <input
          type="text"
          placeholder="Search drugs by name or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-700 placeholder-gray-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100"
        />
      </div>

      {drugs.length === 0 ? (
        <EmptyState
          icon={FiPackage}
          title={search ? 'No drugs match your search' : 'No drugs in catalog'}
          description={search ? 'Try a different search term' : 'Click "Add Drug" to add the first one'}
          action={search ? null : 'Add Drug'}
          onAction={search ? null : openAddModal}
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {drugs.map((drug, idx) => (
              <motion.div
                key={drug._id || drug.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: idx * 0.03 }}
              >
                <DataCard>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-sm">
                        <FiPackage className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{drug.name || 'Unnamed Drug'}</p>
                        {drug.description && (
                          <p className="mt-0.5 text-xs leading-relaxed text-gray-500 line-clamp-2">{drug.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(drug)}
                      className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                    >
                      <FiEdit2 className="h-3.5 w-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(drug)}
                      className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <FiTrash2 className="h-3.5 w-3.5" /> Delete
                    </button>
                  </div>
                </DataCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingDrug ? 'Edit Drug' : 'Add Drug'} size="sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500">Drug Name *</label>
            <input
              type="text"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="e.g. Paracetamol"
              className="w-full rounded-xl border border-gray-200 bg-white py-2.5 px-4 text-sm text-gray-700 placeholder-gray-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100"
              autoFocus
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500">Description</label>
            <textarea
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              placeholder="Drug description, uses, notes..."
              rows={3}
              className="w-full rounded-xl border border-gray-200 bg-white py-2.5 px-4 text-sm text-gray-700 placeholder-gray-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100"
            />
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setShowModal(false)} className="btn-secondary text-sm">Cancel</button>
            <button type="submit" disabled={submitting} className="btn-primary flex items-center gap-2 text-sm">
              <FiSave className="h-4 w-4" /> {submitting ? 'Saving...' : editingDrug ? 'Update' : 'Add Drug'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete Drug" size="sm">
        <div className="space-y-4">
          <div className="flex items-center gap-3 rounded-xl bg-red-50 p-4">
            <FiAlertCircle className="h-5 w-5 shrink-0 text-red-500" />
            <p className="text-sm text-red-700">
              Are you sure you want to delete <strong>{deleteConfirm?.name}</strong>? This action cannot be undone.
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={() => setDeleteConfirm(null)} className="btn-secondary text-sm">Cancel</button>
            <button onClick={() => handleDelete(deleteConfirm)} className="btn-danger text-sm">Delete</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
