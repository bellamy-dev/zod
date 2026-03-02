import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import axios from 'axios'
import { useState } from 'react'


const schema = z.object({
  nom: z.string().min(3, 'nom trop court'),
  prix: z.number({ invalid_type_error: 'mettez un nombre' }),
  description: z.string().min(10, 'description trop courte'),
  productType: z.enum(['gratuit', 'payant'], { message: 'choisissez un type' })
}).refine((data) => {
  // si payant faut que le prix soit > 0
  if (data.productType === 'payant') {
    return data.prix > 0
  }
  return true
}, {
  message: 'prix doit etre > 0 pour un produit payant',
  path: ['prix']
})

function ProductForm() {

  const [msgSucces, setMsgSucces] = useState('')

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(schema)
  })

  const type = watch('productType')

  const envoyer = async (data) => {
    try {
      await axios.post('http://localhost:3000/products', data)
      setMsgSucces('produit ajouté avec succes !')
    } catch (err) {
      console.log('erreur : ', err)
    }
  }

  return (
    <div>
      <h2>Ajouter un produit</h2>

      <form onSubmit={handleSubmit(envoyer)}>

        <div>
          <label>Nom du produit</label>
          <input {...register('nom')} placeholder='nom...' />
          {errors.nom && <p style={{ color: 'red' }}>{errors.nom.message}</p>}
        </div>

        <div>
          <label>Type de produit</label>
          <select {...register('productType')}>
            <option value=''>-- choisir --</option>
            <option value='gratuit'>Gratuit</option>
            <option value='payant'>Payant</option>
          </select>
          {errors.productType && <p style={{ color: 'red' }}>{errors.productType.message}</p>}
        </div>

        {/* le prix saffiche seulement si cest payant */}
        {type === 'payant' && (
          <div>
            <label>Prix</label>
            <input type='number' {...register('prix', { valueAsNumber: true })} placeholder='prix...' />
            {errors.prix && <p style={{ color: 'red' }}>{errors.prix.message}</p>}
          </div>
        )}

        {/* champ  */}
        <div>
          <label>Description</label>
          <textarea {...register('description')} placeholder='description...' />
          {errors.description && <p style={{ color: 'red' }}>{errors.description.message}</p>}
        </div>

        <button type='submit'>Ajouter</button>

      </form>

      {/* msg si sa marche */}
      {msgSucces && <p style={{ color: 'green' }}>{msgSucces}</p>}

    </div>
  )
}

export default ProductForm
