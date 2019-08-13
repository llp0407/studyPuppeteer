         // const std_code_text = await page.$$eval(".listing-level2>.each-category>h4", e => {
            //     const data = []
            //     for(let i2=0;i2<e.length;i2++){
            //         let obj = {}
            //         const text = e[i2].innerText
            //         let star = text.indexOf(' ')
            //         obj.std_code = text.substr(0,star)
            //         obj.std_text = text.substr(star+1)
            //         data.push(obj)
            //     }
            //     return data
            // })
            // console.log('std_code_text',std_code_text)

            // const std_sub_code_text = await page.$$eval(".listing-level3>.each-category>h4", e => {
            //     const data = []
            //     for(let i2=0;i2<e.length;i2++){
            //         let obj = {}
            //         const text = e[i2].innerText
            //         let star = text.indexOf(' ')
            //         obj.std_sub_code = text.substr(0,star)
            //         obj.std_sub_text = text.substr(star+1)
            //         data.push(obj)
            //     }
            //     return data
            // })
            // console.log('std_sub_code_text',std_sub_code_text)
            
            // const ref_code_text = await page.$$eval(".skillLink", e => {
            //     const data = []
            //     for(let i2=0;i2<e.length;i2++){
            //         let obj = {}
            //         const text = e[i2].innerText
            //         let star = text.indexOf('(')
            //         obj.std_code = text.substr(star)
            //         obj.std_text = text.substr(0,star-1)
            //         data.push(obj)
            //     }
            //     return data
            // })
            // console.log('ref_code_text',ref_code_text)

            // for(let i2 =0;i2<std_cat.length;i++){
            //     result.standard = href2[i].standard   //一个standard只有一条std_abbr
            //     result.std_abbr = std_abbr
            //     result.std_cat = std_cat[i2]

            //     for(let i3=0;i3<std_code_text.length;i3++){ //错误
            //         result.std_code = std_code_text[i3].std_code
            //         result.std_text = std_code_text[i3].std_text
            //         for(let i4=0;i4<std_sub_code_text.length;i4++){
            //             result.std_sub_code = std_sub_code_text[i4].std_sub_code
            //             result.std_sub_text = std_sub_code_text[i4].std_sub_text
            //             // for(let i5=0;i5<)
            //         }
            //     }

            // }

            // results.push(result)