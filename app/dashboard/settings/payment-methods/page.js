'use client'
import React, { useState, useEffect } from 'react'
import { useSettingsStore } from '@/store/use-settings-store'
import { useCountryStore } from '@/store/use-country-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { CreditCard, Plus, Loader2, Trash2, Edit, Check, X, ArrowLeft, Image as ImageIcon, PlusCircle, MinusCircle, FileUp, Globe, Settings, Upload, CloudUpload } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { toast } from 'sonner'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { uploadToCloudinaryClient } from '@/lib/cloudinary-client'

export default function PaymentMethodsPage() {
  const { paymentMethods, getPaymentMethods, addPaymentMethod, updatePaymentMethod, deletePaymentMethod, loading } = useSettingsStore()
  const { countries } = useCountryStore()
  
  const [isAddingMethod, setIsAddingMethod] = useState(false)
  const [editingMethodId, setEditingMethodId] = useState(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [selectedTab, setSelectedTab] = useState('general')
  const [selectedCountry, setSelectedCountry] = useState('all')
  const [imagePreview, setImagePreview] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  
  // Estado para los campos personalizados
  const [customFields, setCustomFields] = useState([])
  
  // Estado inicial del formulario con campos adicionales
  const [formData, setFormData] = useState({
    name: '',
    identity: '',
    bank: '',
    bankCode: '',
    email: '',
    contactName: '',
    phone: ''
  })

  useEffect(() => {
    getPaymentMethods()
  }, [getPaymentMethods])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name, checked) => {
    setFormData(prev => ({ ...prev, [name]: checked }))
  }

  const handleCountriesChange = (country) => {
    setFormData(prev => {
      const currentCountries = [...prev.countries]
      if (currentCountries.includes(country)) {
        return { ...prev, countries: currentCountries.filter(c => c !== country) }
      } else {
        return { ...prev, countries: [...currentCountries, country] }
      }
    })
  }

  // Manejar la adición de un campo personalizado
  const addCustomField = () => {
    const newField = {
      id: Date.now().toString(),
      label: '',
      type: 'text', // text, number, email, url
      required: false,
      placeholder: '',
      value: '', // Valor predefinido por el administrador
      userInput: false // Si es true, el usuario debe completarlo. Si es false, ya viene pre-rellenado
    }
    
    setCustomFields(prev => [...prev, newField])
    setFormData(prev => ({
      ...prev,
      customFields: [...prev.customFields, newField]
    }))
  }

  // Manejar la actualización de un campo personalizado
  const updateCustomField = (id, field, value) => {
    setFormData(prev => {
      const updatedFields = prev.customFields.map(f => 
        f.id === id ? { ...f, [field]: value } : f
      )
      return { ...prev, customFields: updatedFields }
    })
  }

  // Manejar la eliminación de un campo personalizado
  const removeCustomField = (id) => {
    setFormData(prev => ({
      ...prev,
      customFields: prev.customFields.filter(f => f.id !== id)
    }))
  }

  // Manejar la carga de una imagen a Cloudinary usando el método del cliente
  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (file) {
      try {
        // Crear una URL para la vista previa temporal mientras se sube
        const previewUrl = URL.createObjectURL(file)
        setImagePreview(previewUrl)
        setImageFile(file)
        setIsUploading(true)
        
        // Mostrar toast de carga
        toast.loading('Subiendo imagen...', { id: 'uploading-image' })
        
        // Subir la imagen a Cloudinary usando el método del cliente
        const cloudinaryUrl = await uploadToCloudinaryClient(file)
        
        // Actualizar el formulario con la URL de Cloudinary
        setFormData(prev => ({ ...prev, imageUrl: cloudinaryUrl }))
        
        // Mostrar toast de éxito
        toast.success('Imagen subida correctamente', { id: 'uploading-image' })
      } catch (error) {
        console.error('Error al subir imagen:', error)
        toast.error('Error al subir la imagen', { id: 'uploading-image' })
        // Limpiar la vista previa en caso de error
        setImagePreview(null)
        setImageFile(null)
      } finally {
        setIsUploading(false)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      identity: '',
      bank: '',
      bankCode: '',
      email: '',
      contactName: '',
      phone: ''
    })
    setCustomFields([])
    setImagePreview(null)
    setImageFile(null)
    setSelectedTab('general')
    setIsAddingMethod(false)
    setEditingMethodId(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      setIsSaving(true)
      
      // La imagen ya debe estar subida a Cloudinary en este punto
      // y la URL almacenada en formData.imageUrl
      
      if (editingMethodId) {
        // Si estamos editando y hay una nueva imagen, eliminar la anterior
        const existingMethod = paymentMethods.find(m => m.id === editingMethodId)
        if (existingMethod && existingMethod.imageUrl && 
            existingMethod.imageUrl !== formData.imageUrl && 
            existingMethod.imageUrl.includes('cloudinary.com')) {
          // Intentar eliminar la imagen anterior de Cloudinary
          try {
            await deleteImage(existingMethod.imageUrl)
          } catch (error) {
            console.error('Error al eliminar imagen anterior:', error)
            // Continuamos con la actualización aunque falle la eliminación
          }
        }
        
        await updatePaymentMethod({
          id: editingMethodId,
          ...formData
        })
        toast.success('Método de pago actualizado correctamente')
      } else {
        await addPaymentMethod(formData)
        toast.success('Método de pago agregado correctamente')
      }
      resetForm()
    } catch (error) {
      toast.error('Error al guardar el método de pago')
      console.error(error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleEdit = (method) => {
    // Establecer los valores del método existente
    setFormData({
      name: method.name || '',
      identity: method.identity || '',
      bank: method.bank || '',
      bankCode: method.bankCode || '',
      email: method.email || '',
      contactName: method.contactName || '',
      phone: method.phone || ''
    })
    
    // Establecer campos personalizados para edición
    setCustomFields(method.customFields || [])
    
    // Establecer vista previa de imagen si existe
    if (method.imageUrl) {
      setImagePreview(method.imageUrl)
    }
    
    setEditingMethodId(method.id)
    setIsAddingMethod(true)
    setSelectedTab('general')
  }

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este método de pago?')) {
      try {
        await deletePaymentMethod(id)
        toast.success('Método de pago eliminado correctamente')
      } catch (error) {
        toast.error('Error al eliminar el método de pago')
        console.error(error)
      }
    }
  }

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6 md:space-y-8">
      {/* Header with Back Button */}
      <div className="flex items-center gap-2 mb-6">
        <Link href="/dashboard/settings">
          <Button variant="ghost" size="icon" className="text-primary-500 hover:bg-primary-500/10 hover:text-primary-300 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary-300 to-primary-500 bg-clip-text text-transparent">
            Métodos de Pago
          </h1>
          <p className="text-gray-400 text-sm md:text-base">
            Administra los métodos de pago disponibles para tus clientes
          </p>
        </div>
      </div>

      {/* Add/Edit Form */}
      {isAddingMethod && (
        <Card className="bg-black/60 border-primary-500/20 shadow-[0_0_15px_rgba(140,82,255,0.05)]">
          <CardHeader>
            <CardTitle className="text-primary-300">
              {editingMethodId ? 'Editar Método de Pago' : 'Agregar Método de Pago'}
            </CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit} className="space-y-4 p-6">
            <div className="space-y-3">
              {/* Campo de imagen/logo */}
              <div>
                <label className="text-sm font-medium text-gray-200 flex items-center gap-2">
                  Logo o imagen del método
                  <span className="text-gray-400 text-xs">(Opcional)</span>
                </label>
                <div className="flex items-center gap-4 mt-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-500/20 file:text-primary-200 hover:file:bg-primary-500/40 transition-all"
                    disabled={isUploading}
                  />
                  {imagePreview && (
                    <div className="relative group">
                      <Image
                        src={imagePreview}
                        alt="Previsualización"
                        width={48}
                        height={48}
                        className="rounded-lg border border-primary-500/40 shadow-md object-cover w-12 h-12"
                      />
                      <button
                        type="button"
                        onClick={() => { setImagePreview(null); setImageFile(null); setFormData(prev => ({ ...prev, imageUrl: undefined })); }}
                        className="absolute -top-2 -right-2 bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Eliminar imagen"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
                {isUploading && (
                  <div className="text-xs text-primary-400 mt-1 flex items-center gap-1"><Loader2 className="w-4 h-4 animate-spin" /> Subiendo imagen...</div>
                )}
              </div>
              {/* Campos de texto */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="text-sm font-medium text-gray-200">Nombre del método de pago <span className="text-gray-400 text-xs">(Opcional)</span></label>
                  <Input name="name" value={formData.name} onChange={handleInputChange} placeholder="ej: PayPal, Zelle, etc." className="bg-primary-500/10 border-none focus:ring-2 focus:ring-primary-500/50" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-200">Cédula de Identidad</label>
                  <Input name="identity" value={formData.identity} onChange={handleInputChange} placeholder="V-12345678" className="bg-primary-500/10 border-none focus:ring-2 focus:ring-primary-500/50" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-200">Nombre del Banco <span className="text-gray-400 text-xs">(Opcional)</span></label>
                  <Input name="bank" value={formData.bank} onChange={handleInputChange} placeholder="ej: Banco Mercantil" className="bg-primary-500/10 border-none focus:ring-2 focus:ring-primary-500/50" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-200">Código del Banco <span className="text-gray-400 text-xs">(Opcional)</span></label>
                  <Input name="bankCode" value={formData.bankCode} onChange={handleInputChange} placeholder="ej: 0105" className="bg-primary-500/10 border-none focus:ring-2 focus:ring-primary-500/50" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-200">Correo electrónico <span className="text-gray-400 text-xs">(Opcional)</span></label>
                  <Input name="email" value={formData.email} onChange={handleInputChange} placeholder="correo@ejemplo.com" className="bg-primary-500/10 border-none focus:ring-2 focus:ring-primary-500/50" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-200">Nombre de contacto <span className="text-gray-400 text-xs">(Opcional)</span></label>
                  <Input name="contactName" value={formData.contactName} onChange={handleInputChange} placeholder="Nombre completo" className="bg-primary-500/10 border-none focus:ring-2 focus:ring-primary-500/50" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-200">Teléfono <span className="text-gray-400 text-xs">(Opcional)</span></label>
                  <Input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+58 424 1234567" className="bg-primary-500/10 border-none focus:ring-2 focus:ring-primary-500/50" />
                </div>
              </div>
            </div>
            <Button type="submit" disabled={isSaving} className="w-full mt-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white text-lg py-3 font-semibold rounded">
              {isSaving ? <Loader2 className="h-5 w-5 animate-spin mr-2 inline" /> : null}
              {editingMethodId ? 'Actualizar Método de Pago' : 'Agregar Método de Pago'}
            </Button>
            <Button type="button" variant="ghost" onClick={resetForm} className="w-full mt-2 text-gray-400 hover:text-primary-400">
              Cancelar
            </Button>
          </form>
        </Card>
      )}

      {/* Payment Methods List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-primary-300">Métodos de Pago Disponibles</h2>
          {!isAddingMethod && (
            <Button 
              onClick={() => setIsAddingMethod(true)}
              className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white transition-all duration-300"
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar Método
            </Button>
          )}
        </div>

        {/* Loading State */}
        {loading && !isAddingMethod && (
          <div className="flex flex-col items-center justify-center py-8 md:py-12">
            <Loader2 className="w-8 h-8 md:w-10 md:h-10 animate-spin text-primary-500" />
            <p className="text-gray-400 mt-4 text-sm md:text-base">
              Cargando métodos de pago...
            </p>
          </div>
        )}

        {/* Empty State */}
        {!loading && paymentMethods.length === 0 && (
          <div className="text-center py-8 md:py-12 bg-black/50 rounded-lg border border-primary-500/20 px-4 shadow-[0_0_15px_rgba(140,82,255,0.05)]">
            <CreditCard className="w-10 h-10 md:w-12 md:h-12 text-primary-500/70 mx-auto mb-3 md:mb-4" />
            <h3 className="text-lg md:text-xl font-semibold text-primary-300 mb-2">
              No hay métodos de pago configurados
            </h3>
            <p className="text-gray-400 mb-4 text-sm md:text-base">
              Agrega métodos de pago para que tus clientes puedan comprar tickets
            </p>
            <Button 
              onClick={() => setIsAddingMethod(true)}
              className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white transition-all duration-300"
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar Método
            </Button>
          </div>
        )}

        {/* Payment Methods Grid */}
        {!loading && paymentMethods.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paymentMethods.map((method) => (
              <Card key={method.id} className="bg-black/60 border-primary-500/20 shadow-[0_0_15px_rgba(140,82,255,0.05)] hover:shadow-[0_0_20px_rgba(140,82,255,0.1)] transition-all duration-300">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex items-center gap-2">
                      {method.imageUrl && (
                        <Image src={method.imageUrl} alt={method.name || 'Logo'} width={32} height={32} className="rounded-md border border-primary-500/30 bg-black/30 object-cover w-8 h-8" />
                      )}
                      <CardTitle className="text-lg font-medium text-primary-300">
                        {method.name}
                      </CardTitle>
                    </div>
                    <CreditCard className="h-5 w-5 text-primary-500" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div>
                    {method.identity && (
                      <>
                        <p className="text-gray-400">Cédula:</p>
                        <p className="text-white font-medium">{method.identity}</p>
                      </>
                    )}
                  </div>
                  <div>
                    {method.bank && (
                      <>
                        <p className="text-gray-400">Banco:</p>
                        <p className="text-white font-medium">{method.bank}</p>
                      </>
                    )}
                  </div>
                  <div>
                    {method.bankCode && (
                      <>
                        <p className="text-gray-400">Código del Banco:</p>
                        <p className="text-white font-medium">{method.bankCode}</p>
                      </>
                    )}
                  </div>
                  <div>
                    {method.email && (
                      <>
                        <p className="text-gray-400">Correo:</p>
                        <p className="text-white font-medium">{method.email}</p>
                      </>
                    )}
                  </div>
                  <div>
                    {method.contactName && (
                      <>
                        <p className="text-gray-400">Contacto:</p>
                        <p className="text-white font-medium">{method.contactName}</p>
                      </>
                    )}
                  </div>
                  <div>
                    {method.phone && (
                      <>
                        <p className="text-gray-400">Teléfono:</p>
                        <p className="text-white font-medium">{method.phone}</p>
                      </>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleEdit(method)}
                    className="border-primary-500/30 text-primary-400 hover:text-primary-300 hover:bg-primary-500/10 transition-all duration-300"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleDelete(method.id)}
                    className="border-secondary-500/30 text-secondary-400 hover:text-secondary-300 hover:bg-secondary-500/10 transition-all duration-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
