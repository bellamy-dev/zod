// le serveur express jvais essayer de faire la validation avec zod
const express = require('express')
const cors = require('cors')
const { z } = require('zod')
const db = require('./db')

const app = express()
app.use(cors())
app.use(express.json())

// schema zod pour valider le produit
const produitSchema = z.object({
  nom: z.string().min(3, 'le nom doit faire au moin 3 caracteres'),
  prix: z.number(),
  description: z.string().min(10, 'description trop courte'),
  productType: z.enum(['gratuit', 'payant'])
}).refine((data) => {
  // si cest payant le prix doit etre superieur a 0
  if (data.productType === 'payant') {
    return data.prix > 0
  }
  return true
}, {
  message: 'le prix doit etre superieur a 0 si le produit est payant',
  path: ['prix']
})

// route pour ajouter un produit
app.post('/products', (req, res) => {

  const result = produitSchema.safeParse(req.body)

  // si ya des erreurs on renvoi 400
  if (!result.success) {
    return res.status(400).json({ erreurs: result.error.errors })
  }

  const { nom, prix, description, productType } = result.data

  // requete preparee pour inserer dans mysql
  const sql = 'INSERT INTO produits (nom, prix, description, type) VALUES (?, ?, ?, ?)'

  db.query(sql, [nom, prix, description, productType], (err, rows) => {
    if (err) {
      console.log('erreur mysql : ', err)
      return res.status(500).json({ message: 'erreur serveur' })
    }
    res.status(201).json({ message: 'produit ajouter' })
  })
})

app.listen(3000, () => {
  console.log('serveur sur port 3000')
})
