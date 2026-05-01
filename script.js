const fs = require('fs');

let code = fs.readFileSync('app/supplier/page.tsx', 'utf8');

const target1 = `    const { error } = await supabase\r
      .from("supplier_products")\r
      .insert({\r
        supplier_id: user.id,\r
        name: form.name,\r
        description: form.description,\r
        product_type: form.product_type,\r
        price: parseFloat(form.price) || 0,\r
        image_url: form.image_url,\r
        tags: form.tags,\r
        available_colors: form.available_colors,\r
        status: "PENDING",\r
      });`;

const replacement1 = `    const payload = {
      supplier_id: user.id,
      name: form.name,
      description: form.description,
      product_type: form.product_type,
      price: parseFloat(form.price) || 0,
      image_url: form.image_url,
      tags: form.tags,
      available_colors: form.available_colors,
      status: "PENDING",
    };

    let error;
    if (editingProductId) {
      const res = await supabase.from("supplier_products").update(payload).eq("id", editingProductId);
      error = res.error;
    } else {
      const res = await supabase.from("supplier_products").insert(payload);
      error = res.error;
    }`;

code = code.replace(target1, replacement1);
code = code.replace("setShowForm(false);", "setEditingProductId(null);\n      setActiveTab('my-products');");

fs.writeFileSync('app/supplier/page.tsx', code);
console.log('Script ran!');
