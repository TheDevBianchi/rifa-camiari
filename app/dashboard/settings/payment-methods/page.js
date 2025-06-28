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
    type: 'bank_transfer', // bank_transfer, crypto, cash, other
    accountNumber: '',
    accountHolder: '',
    instructions: '',
    imageUrl: '',
    countries: [], // Lista de países donde está disponible este método
    customFields: [], // Campos personalizados que el admin puede agregar
    active: true
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
      type: 'bank_transfer',
      accountNumber: '',
      accountHolder: '',
      instructions: '',
      imageUrl: '',
      countries: [],
      customFields: [],
      active: true
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
      name: method.name,
      type: method.type || 'bank_transfer',
      accountNumber: method.accountNumber || '',
      accountHolder: method.accountHolder || '',
      instructions: method.instructions || '',
      imageUrl: method.imageUrl || '',
      countries: method.countries || [],
      customFields: method.customFields || [],
      active: method.active !== undefined ? method.active : true
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
          <Button variant="ghost" size="icon" className="text-amber-500 hover:bg-amber-500/10 hover:text-amber-300 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
            Métodos de Pago
          </h1>
          <p className="text-gray-400 text-sm md:text-base">
            Administra los métodos de pago disponibles para tus clientes
          </p>
        </div>
      </div>

      {/* Add/Edit Form */}
      {isAddingMethod && (
        <Card className="bg-black/60 border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.05)]">
          <CardHeader>
            <CardTitle className="text-amber-300">
              {editingMethodId ? 'Editar Método de Pago' : 'Agregar Método de Pago'}
            </CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
              <div className="px-6">
                <TabsList className="bg-black/40 border border-amber-500/20 w-full justify-start mb-6">
                  <TabsTrigger 
                    value="general" 
                    className="data-[state=active]:bg-amber-500 data-[state=active]:text-black"
                  >
                    General
                  </TabsTrigger>
                  <TabsTrigger 
                    value="countries" 
                    className="data-[state=active]:bg-amber-500 data-[state=active]:text-black"
                  >
                    Países
                  </TabsTrigger>
                  <TabsTrigger 
                    value="fields" 
                    className="data-[state=active]:bg-amber-500 data-[state=active]:text-black"
                  >
                    Campos Personalizados
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="general" className="mt-0">
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-200">Nombre del Método</label>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Ej: Transferencia Bancaria"
                        required
                        className="bg-black/50 border-gray-700/50 focus-visible:ring-amber-500/50 focus:ring-amber-500/50 focus:border-amber-500/50 transition-colors"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-200">Tipo de Método</label>
                      <Select 
                        value={formData.type} 
                        onValueChange={(value) => handleSelectChange('type', value)}
                      >
                        <SelectTrigger className="bg-black/50 border-gray-700/50 focus-visible:ring-amber-500/50 focus:ring-amber-500/50 focus:border-amber-500/50 transition-colors">
                          <SelectValue placeholder="Selecciona un tipo" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-gray-700">
                          <SelectItem value="bank_transfer" className="text-gray-200 hover:bg-amber-500/10 focus:bg-amber-500/10">
                            Transferencia Bancaria
                          </SelectItem>
                          <SelectItem value="crypto" className="text-gray-200 hover:bg-amber-500/10 focus:bg-amber-500/10">
                            Criptomoneda
                          </SelectItem>
                          <SelectItem value="cash" className="text-gray-200 hover:bg-amber-500/10 focus:bg-amber-500/10">
                            Efectivo
                          </SelectItem>
                          <SelectItem value="other" className="text-gray-200 hover:bg-amber-500/10 focus:bg-amber-500/10">
                            Otro
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-200">Número de Cuenta</label>
                    <Input
                      name="accountNumber"
                      value={formData.accountNumber}
                      onChange={handleInputChange}
                      placeholder="Ej: 1234-5678-9012-3456"
                      className="bg-black/50 border-gray-700/50 focus-visible:ring-amber-500/50 focus:ring-amber-500/50 focus:border-amber-500/50 transition-colors"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-200">Titular de la Cuenta</label>
                    <Input
                      name="accountHolder"
                      value={formData.accountHolder}
                      onChange={handleInputChange}
                      placeholder="Ej: Juan Pérez"
                      className="bg-black/50 border-gray-700/50 focus-visible:ring-amber-500/50 focus:ring-amber-500/50 focus:border-amber-500/50 transition-colors"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-200">Instrucciones (opcional)</label>
                    <Textarea
                      name="instructions"
                      value={formData.instructions}
                      onChange={handleInputChange}
                      placeholder="Instrucciones adicionales para el pago..."
                      className="bg-black/50 border-gray-700/50 focus-visible:ring-amber-500/50 focus:ring-amber-500/50 focus:border-amber-500/50 transition-colors"
                      rows={3}
                    />
                  </div>
                  
                  {/* Imagen del método de pago */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="dropzone-file"
                        className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-700/30 ${isUploading ? 'opacity-70 cursor-not-allowed' : ''} ${imagePreview ? 'border-amber-500/50 hover:border-amber-500/70' : 'border-gray-600 hover:border-gray-500'}`}
                      >
                        {imagePreview ? (
                          <div className="relative w-full h-full">
                            <Image
                              src={imagePreview}
                              alt="Vista previa"
                              fill
                              className="object-contain p-2"
                              unoptimized={!formData.imageUrl.includes('cloudinary')}
                            />
                            {isUploading && (
                              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                                <div className="flex flex-col items-center">
                                  <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                                  <p className="text-xs text-white">Subiendo imagen...</p>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <CloudUpload className="w-8 h-8 mb-3 text-amber-500/70" />
                            <p className="mb-2 text-sm text-gray-400">
                              <span className="font-medium">Haz clic para subir</span> o arrastra y suelta
                            </p>
                            <p className="text-xs text-gray-400">
                              PNG, JPG o SVG (se optimizará automáticamente)
                            </p>
                          </div>
                        )}
                        <input
                          id="dropzone-file"
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={isUploading}
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">Formatos: JPG, PNG. Tamaño máximo: 2MB</p>
                  </div>
                  
                  <div className="flex items-center space-x-2 pt-2">
                    <Switch
                      id="active"
                      checked={formData.active}
                      onCheckedChange={(checked) => handleSwitchChange('active', checked)}
                      className="data-[state=checked]:bg-amber-500"
                    />
                    <Label htmlFor="active" className="text-gray-200">Método de Pago Activo</Label>
                  </div>
                </CardContent>
              </TabsContent>
              
              <TabsContent value="countries" className="mt-0">
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-200 mb-3 block">Países donde está disponible este método</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {countries.map((country) => (
                        <div 
                          key={country.name} 
                          className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all duration-200 ${formData.countries.includes(country.name) 
                            ? 'bg-amber-500/10 border-amber-500/40' 
                            : 'bg-black/40 border-gray-700/50 hover:border-amber-500/30'}`}
                          onClick={() => handleCountriesChange(country.name)}
                        >
                          <div className="w-6 h-6 rounded-full overflow-hidden relative">
                            <Image 
                              src={country.flag} 
                              alt={country.name} 
                              width={24} 
                              height={24} 
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                          <span className={`text-sm ${formData.countries.includes(country.name) ? 'text-amber-300' : 'text-gray-300'}`}>
                            {country.name}
                          </span>
                          {formData.countries.includes(country.name) && (
                            <Check className="h-4 w-4 ml-auto text-amber-500" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-amber-500/5 border border-amber-500/10 rounded-lg p-4 text-sm text-gray-400">
                    <p className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-amber-500" />
                      Si no seleccionas ningún país, este método de pago estará disponible para todos los países.
                    </p>
                  </div>
                </CardContent>
              </TabsContent>
              
              <TabsContent value="fields" className="mt-0">
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-gray-200">Campos Personalizados</label>
                    <Button 
                      type="button" 
                      size="sm" 
                      variant="outline" 
                      onClick={addCustomField}
                      className="border-amber-500/30 text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 transition-all duration-300"
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Agregar Campo
                    </Button>
                  </div>
                  
                  {formData.customFields.length === 0 ? (
                    <div className="text-center py-8 bg-black/40 rounded-lg border border-amber-500/10">
                      <p className="text-gray-400 text-sm">
                        No hay campos personalizados. Agrega campos para solicitar información adicional.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {formData.customFields.map((field, index) => (
                        <div key={field.id} className="bg-black/40 border border-amber-500/10 rounded-lg p-4 space-y-3">
                          <div className="flex justify-between items-center">
                            <h4 className="text-sm font-medium text-amber-300">Campo {index + 1}</h4>
                            <Button 
                              type="button" 
                              size="icon" 
                              variant="ghost" 
                              onClick={() => removeCustomField(field.id)}
                              className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            >
                              <MinusCircle className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="space-y-2">
                              <label className="text-xs text-gray-300">Etiqueta</label>
                              <Input
                                value={field.label}
                                onChange={(e) => updateCustomField(field.id, 'label', e.target.value)}
                                placeholder="Ej: Código de Referencia"
                                className="bg-black/50 border-gray-700/50 focus-visible:ring-amber-500/50 focus:ring-amber-500/50 focus:border-amber-500/50 transition-colors"
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <label className="text-xs text-gray-300">Tipo de Campo</label>
                              <Select 
                                value={field.type} 
                                onValueChange={(value) => updateCustomField(field.id, 'type', value)}
                              >
                                <SelectTrigger className="bg-black/50 border-gray-700/50 focus-visible:ring-amber-500/50 focus:ring-amber-500/50 focus:border-amber-500/50 transition-colors">
                                  <SelectValue placeholder="Selecciona un tipo" />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-900 border-gray-700">
                                  <SelectItem value="text" className="text-gray-200 hover:bg-amber-500/10 focus:bg-amber-500/10">
                                    Texto
                                  </SelectItem>
                                  <SelectItem value="number" className="text-gray-200 hover:bg-amber-500/10 focus:bg-amber-500/10">
                                    Número
                                  </SelectItem>
                                  <SelectItem value="email" className="text-gray-200 hover:bg-amber-500/10 focus:bg-amber-500/10">
                                    Email
                                  </SelectItem>
                                  <SelectItem value="url" className="text-gray-200 hover:bg-amber-500/10 focus:bg-amber-500/10">
                                    URL
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-xs text-gray-300">Placeholder</label>
                            <Input
                              value={field.placeholder}
                              onChange={(e) => updateCustomField(field.id, 'placeholder', e.target.value)}
                              placeholder="Ej: Ingrese el código de referencia"
                              className="bg-black/50 border-gray-700/50 focus-visible:ring-amber-500/50 focus:ring-amber-500/50 focus:border-amber-500/50 transition-colors"
                            />
                          </div>
                          
                          <div className="flex items-center justify-between pt-2 pb-1">
                            <div className="flex items-center space-x-2">
                              <Switch
                                id={`required-${field.id}`}
                                checked={field.required}
                                onCheckedChange={(checked) => updateCustomField(field.id, 'required', checked)}
                                className="data-[state=checked]:bg-amber-500"
                              />
                              <Label htmlFor={`required-${field.id}`} className="text-gray-300 text-xs">
                                Campo Requerido
                              </Label>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Switch
                                id={`userInput-${field.id}`}
                                checked={field.userInput}
                                onCheckedChange={(checked) => updateCustomField(field.id, 'userInput', checked)}
                                className="data-[state=checked]:bg-amber-500"
                              />
                              <Label htmlFor={`userInput-${field.id}`} className="text-gray-300 text-xs">
                                Completado por el usuario
                              </Label>
                            </div>
                          </div>
                          
                          {!field.userInput && (
                            <div className="space-y-2 pt-2 border-t border-gray-800">
                              <label className="text-xs text-gray-300 flex items-center gap-1">
                                <Settings className="h-3 w-3 text-amber-500" />
                                Valor predefinido
                              </label>
                              <Input
                                value={field.value || ''}
                                onChange={(e) => updateCustomField(field.id, 'value', e.target.value)}
                                placeholder="Valor que verá el usuario"
                                className="bg-black/50 border-gray-700/50 focus-visible:ring-amber-500/50 focus:ring-amber-500/50 focus:border-amber-500/50 transition-colors"
                              />
                              <p className="text-xs text-amber-400/70 italic">
                                Este valor aparecerá pre-rellenado para el usuario
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="bg-amber-500/5 border border-amber-500/10 rounded-lg p-4 text-sm text-gray-400">
                    <p className="mb-2">
                      Los campos personalizados te permiten configurar información adicional para este método de pago.
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li><strong className="text-amber-400">Completado por el usuario:</strong> Si está activado, el usuario deberá ingresar este dato durante la compra.</li>
                      <li><strong className="text-amber-400">Valor predefinido:</strong> Si &ldquo;Completado por el usuario&rdquo; está desactivado, este valor aparecerá pre-rellenado y no podrá ser modificado por el usuario.</li>
                    </ul>
                  </div>
                </CardContent>
              </TabsContent>
            </Tabs>
            
            <CardFooter className="flex justify-between">
              <Button 
                type="button" 
                variant="outline" 
                onClick={resetForm}
                className="border-amber-500/30 text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 transition-all duration-300"
              >
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={isSaving}
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black transition-all duration-300"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    {editingMethodId ? 'Actualizar' : 'Guardar'}
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}

      {/* Payment Methods List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-amber-300">Métodos de Pago Disponibles</h2>
          {!isAddingMethod && (
            <Button 
              onClick={() => setIsAddingMethod(true)}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black transition-all duration-300"
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar Método
            </Button>
          )}
        </div>

        {/* Loading State */}
        {loading && !isAddingMethod && (
          <div className="flex flex-col items-center justify-center py-8 md:py-12">
            <Loader2 className="w-8 h-8 md:w-10 md:h-10 animate-spin text-amber-500" />
            <p className="text-gray-400 mt-4 text-sm md:text-base">
              Cargando métodos de pago...
            </p>
          </div>
        )}

        {/* Empty State */}
        {!loading && paymentMethods.length === 0 && (
          <div className="text-center py-8 md:py-12 bg-black/50 rounded-lg border border-amber-500/20 px-4 shadow-[0_0_15px_rgba(245,158,11,0.05)]">
            <CreditCard className="w-10 h-10 md:w-12 md:h-12 text-amber-500/70 mx-auto mb-3 md:mb-4" />
            <h3 className="text-lg md:text-xl font-semibold text-amber-300 mb-2">
              No hay métodos de pago configurados
            </h3>
            <p className="text-gray-400 mb-4 text-sm md:text-base">
              Agrega métodos de pago para que tus clientes puedan comprar tickets
            </p>
            <Button 
              onClick={() => setIsAddingMethod(true)}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black transition-all duration-300"
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
              <Card key={method.id} className="bg-black/60 border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.05)] hover:shadow-[0_0_20px_rgba(245,158,11,0.1)] transition-all duration-300">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-medium text-amber-300">
                      {method.name}
                    </CardTitle>
                    <CreditCard className="h-5 w-5 text-amber-500" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div>
                    <p className="text-gray-400">Número de Cuenta:</p>
                    <p className="text-white font-medium">{method.accountNumber}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Titular:</p>
                    <p className="text-white font-medium">{method.accountHolder}</p>
                  </div>
                  {method.instructions && (
                    <div>
                      <p className="text-gray-400">Instrucciones:</p>
                      <p className="text-gray-300">{method.instructions}</p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleEdit(method)}
                    className="border-amber-500/30 text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 transition-all duration-300"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleDelete(method.id)}
                    className="border-red-500/30 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-300"
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
