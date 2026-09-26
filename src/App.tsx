import { useState } from 'react'
import { ProductFormModal } from './components/ProductFormModal'
import { ProductsTable } from './components/ProductsTable'
import {
  useCreateProductMutation,
  useDeleteProductMutation,
  useProductsQuery,
  useUpdateProductMutation,
} from './hooks/useProducts'
import type { Product, ProductInput } from './types/product'

function App() {
  const { data: products, isLoading, isError } = useProductsQuery()
  const createProduct = useCreateProductMutation()
  const updateProduct = useUpdateProductMutation()
  const deleteProduct = useDeleteProductMutation()

  const [modalOpen, setModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  function openCreateModal() {
    setEditingProduct(null)
    setModalOpen(true)
  }

  function openEditModal(product: Product) {
    setEditingProduct(product)
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setEditingProduct(null)
  }

  function handleSubmit(input: ProductInput) {
    if (editingProduct) {
      updateProduct.mutate({ id: editingProduct.id, input })
    } else {
      createProduct.mutate(input)
    }
    closeModal()
  }

  return (
    <main className="min-h-screen bg-slate-950 p-8 text-slate-100">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Productos</h1>
          <button
            type="button"
            onClick={openCreateModal}
            className="rounded bg-purple-600 px-4 py-2 text-sm hover:bg-purple-500"
          >
            Nuevo producto
          </button>
        </div>

        {isLoading && <p className="text-slate-400">Cargando productos...</p>}
        {isError && <p className="text-red-400">Error al cargar productos.</p>}

        {products && (
          <ProductsTable
            products={products}
            onEdit={openEditModal}
            onDelete={(id) => deleteProduct.mutate(id)}
          />
        )}
      </div>

      {modalOpen && (
        <ProductFormModal
          key={editingProduct?.id ?? 'new'}
          product={editingProduct}
          onClose={closeModal}
          onSubmit={handleSubmit}
        />
      )}
    </main>
  )
}

export default App
