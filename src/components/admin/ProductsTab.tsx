import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product, ProductVariant, ProductAddOn } from '../../types';
import { Package, Plus, Edit2, Archive, CheckCircle, Tag, Layers, ArrowUpRight } from 'lucide-react';

export const ProductsTab: React.FC = () => {
  const { tenantProducts: products, addProduct, updateProduct } = useApp();

  const [isAdding, setIsAdding] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [type, setType] = useState<Product['type']>('SOFTWARE');
  const [salesPrice, setSalesPrice] = useState(999);
  const [costPrice, setCostPrice] = useState(250);
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');

  // Variants and Add-ons builder
  const [variants, setVariants] = useState<ProductVariant[]>([
    { id: 'v1', name: 'Standard', priceDelta: 0, description: 'Base tier' },
    { id: 'v2', name: 'Enterprise', priceDelta: 2000, description: 'Full feature set' },
  ]);
  const [addOns, setAddOns] = useState<ProductAddOn[]>([
    { id: 'a1', name: 'Extra 50GB Storage', price: 499, billingType: 'PER_MONTH' },
  ]);

  const openAddModal = () => {
    setName('');
    setType('SOFTWARE');
    setSalesPrice(999);
    setCostPrice(250);
    setDescription('');
    setNotes('');
    setVariants([
      { id: 'v1', name: 'Standard', priceDelta: 0, description: 'Base tier' },
      { id: 'v2', name: 'Enterprise', priceDelta: 2000, description: 'Full feature set' },
    ]);
    setAddOns([{ id: 'a1', name: 'Extra 50GB Storage', price: 499, billingType: 'PER_MONTH' }]);
    setIsAdding(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setType(p.type);
    setSalesPrice(p.salesPrice);
    setCostPrice(p.costPrice);
    setDescription(p.description);
    setNotes(p.notes || '');
    setVariants(p.variants || []);
    setAddOns(p.addOns || []);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name,
        type,
        salesPrice,
        costPrice,
        description,
        notes,
        variants,
        addOns,
      });
      setEditingProduct(null);
    } else {
      addProduct({
        name,
        type,
        salesPrice,
        costPrice,
        description,
        notes,
        variants,
        addOns,
        status: 'ACTIVE',
      });
      setIsAdding(false);
    }
  };

  const handleArchiveToggle = (p: Product) => {
    updateProduct(p.id, {
      status: p.status === 'ACTIVE' ? 'ARCHIVED' : 'ACTIVE',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-[#E9E2DA] shadow-xs">
        <div>
          <h2 className="text-sm font-bold text-[#292526]">Product & Service Catalog</h2>
          <p className="text-xs text-[#777174]">
            Manage products, edition variants, recurring add-ons, and margin tracking.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="px-4 py-2 text-xs font-semibold text-white bg-[#701F35] hover:bg-[#591728] rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Product List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p) => {
          const margin = p.salesPrice - p.costPrice;
          const marginPct = p.salesPrice > 0 ? Math.round((margin / p.salesPrice) * 100) : 0;

          return (
            <div
              key={p.id}
              className={`bg-white border rounded-xl p-5 shadow-xs flex flex-col justify-between transition-all ${
                p.status === 'ARCHIVED' ? 'opacity-60 border-dashed border-[#E9E2DA]' : 'border-[#E9E2DA]'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#701F35] bg-[#F7EBEF] px-2 py-0.5 rounded">
                      {p.type}
                    </span>
                    <h3 className="text-sm font-bold text-[#292526] mt-1">{p.name}</h3>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      p.status === 'ACTIVE' ? 'bg-[#DDEBDD] text-[#1E4620]' : 'bg-[#F8F3E9] text-[#777174]'
                    }`}
                  >
                    {p.status}
                  </span>
                </div>

                <p className="text-xs text-[#777174] leading-relaxed">{p.description}</p>

                {/* Price & Margin strip */}
                <div className="p-3 rounded-lg bg-[#F8F3E9] border border-[#E9E2DA] flex items-center justify-between text-xs">
                  <div>
                    <div className="text-[10px] text-[#777174]">Base Sales Price</div>
                    <div className="text-sm font-bold text-[#292526] font-mono tabular-nums">
                      ₹{p.salesPrice.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-[#777174]">Gross Margin</div>
                    <div className="text-xs font-semibold text-[#1E4620] font-mono tabular-nums">
                      ₹{margin.toLocaleString()} ({marginPct}%)
                    </div>
                  </div>
                </div>

                {/* Variants Preview */}
                {p.variants && p.variants.length > 0 && (
                  <div className="space-y-1">
                    <div className="text-[11px] font-semibold text-[#292526]">Variants ({p.variants.length}):</div>
                    <div className="flex flex-wrap gap-1">
                      {p.variants.map((v) => (
                        <span key={v.id} className="text-[10px] bg-[#F8F3E9] text-[#777174] px-2 py-0.5 rounded border border-[#E9E2DA]">
                          {v.name} (+₹{v.priceDelta})
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add-ons Preview */}
                {p.addOns && p.addOns.length > 0 && (
                  <div className="space-y-1">
                    <div className="text-[11px] font-semibold text-[#292526]">Available Add-ons:</div>
                    <div className="text-xs text-[#777174] space-y-0.5">
                      {p.addOns.map((a) => (
                        <div key={a.id} className="flex justify-between text-[11px]">
                          <span>{a.name}</span>
                          <span className="font-mono font-medium text-[#292526]">₹{a.price}/mo</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="pt-4 border-t border-[#E9E2DA] mt-4 flex items-center justify-between text-xs">
                <button
                  onClick={() => openEditModal(p)}
                  className="text-[#701F35] font-semibold hover:underline flex items-center gap-1"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Product</span>
                </button>
                <button
                  onClick={() => handleArchiveToggle(p)}
                  className="text-[#777174] hover:text-[#292526]"
                >
                  {p.status === 'ACTIVE' ? 'Archive' : 'Restore'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Product Modal */}
      {(isAdding || editingProduct) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white border border-[#E9E2DA] rounded-xl w-full max-w-lg my-6 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-[#E9E2DA] flex items-center justify-between bg-[#F8F3E9]">
              <h3 className="text-sm font-bold text-[#292526]">
                {editingProduct ? 'Edit Product Catalog Item' : 'Create New Product'}
              </h3>
              <button
                onClick={() => {
                  setIsAdding(false);
                  setEditingProduct(null);
                }}
                className="p-1.5 text-[#777174] hover:text-[#292526] rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 space-y-4 text-xs overflow-y-auto">
              <div>
                <label className="block font-medium text-[#292526] mb-1">Product Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. High Throughput API Connector"
                  className="w-full px-3 py-2 border border-[#E9E2DA] rounded-lg focus:outline-none focus:border-[#701F35] bg-white"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-[#292526] mb-1">Product Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-[#E9E2DA] rounded-lg focus:outline-none focus:border-[#701F35] bg-white"
                  >
                    <option value="SOFTWARE">SOFTWARE</option>
                    <option value="SERVICE">SERVICE</option>
                    <option value="PHYSICAL">PHYSICAL</option>
                    <option value="USAGE_BASED">USAGE_BASED</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-[#292526] mb-1">Sales Price (₹) *</label>
                  <input
                    type="number"
                    value={salesPrice}
                    onChange={(e) => setSalesPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-[#E9E2DA] rounded-lg focus:outline-none focus:border-[#701F35] bg-white font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#292526] mb-1">Cost Price (₹)</label>
                  <input
                    type="number"
                    value={costPrice}
                    onChange={(e) => setCostPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-[#E9E2DA] rounded-lg focus:outline-none focus:border-[#701F35] bg-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-[#292526] mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Product capabilities, features and billing characteristics"
                  className="w-full px-3 py-2 border border-[#E9E2DA] rounded-lg focus:outline-none focus:border-[#701F35] bg-white resize-none"
                />
              </div>

              {/* Add-on management */}
              <div className="space-y-2 p-3 bg-[#F8F3E9] rounded-lg border border-[#E9E2DA]">
                <div className="font-semibold text-[#292526] flex items-center justify-between">
                  <span>Add-on Products & Services</span>
                  <button
                    type="button"
                    onClick={() =>
                      setAddOns([
                        ...addOns,
                        { id: `a_${Date.now()}`, name: 'New Optional Add-on', price: 299, billingType: 'PER_MONTH' },
                      ])
                    }
                    className="text-[11px] text-[#701F35] font-bold hover:underline"
                  >
                    + Add Row
                  </button>
                </div>
                {addOns.map((a, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={a.name}
                      onChange={(e) => {
                        const next = [...addOns];
                        next[idx].name = e.target.value;
                        setAddOns(next);
                      }}
                      className="flex-1 px-2 py-1 border border-[#E9E2DA] rounded bg-white"
                      placeholder="Add-on name"
                    />
                    <input
                      type="number"
                      value={a.price}
                      onChange={(e) => {
                        const next = [...addOns];
                        next[idx].price = Number(e.target.value);
                        setAddOns(next);
                      }}
                      className="w-20 px-2 py-1 border border-[#E9E2DA] rounded bg-white font-mono"
                      placeholder="Price"
                    />
                    <button
                      type="button"
                      onClick={() => setAddOns(addOns.filter((_, i) => i !== idx))}
                      className="text-[#701F35] px-1 hover:font-bold"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-[#E9E2DA]">
                <button
                  type="button"
                  onClick={() => {
                    setIsAdding(false);
                    setEditingProduct(null);
                  }}
                  className="px-4 py-2 border border-[#E9E2DA] text-[#777174] hover:bg-[#F8F3E9] rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#701F35] text-white hover:bg-[#591728] rounded-lg font-semibold"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
