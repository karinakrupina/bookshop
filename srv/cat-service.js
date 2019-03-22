/**
 * Implementation for CatalogService defined in ./cat-service.cds
 */
module.exports = (srv)=>{

    // Use reflection to get the csn definition of Books
    const {Books} = cds.entities
    
    // Reduce stock of books upon incoming orders
    srv.before ('CREATE','Orders', async (req)=>{
      const tx = cds.transaction(req), order = req.data
      const affectedRows = await tx.run (
        UPDATE(Books) .where ({ID:order.book_ID})
        .and (`stock >=`,order.amount)
        .set (`stock -=`,order.amount)
      )
      if (!affectedRows) req.error (409,'Sold out, sorry')
    })
  
  }