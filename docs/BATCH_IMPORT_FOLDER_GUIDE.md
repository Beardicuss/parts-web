# Product folder preparation guide

This guide explains how to prepare product images before using **Admin → Batch import**.

---

## English instructions

### 1. Create the main folder

Create one folder named exactly:

```text
Products
```

All images intended for the batch import must be placed somewhere inside this folder.

### 2. Use the required folder structure

Organize every image using this structure:

```text
Products/
  Brand/
    Vehicle model or platform/
      Website category/
        Part type/
          PRODUCT-CODE.webp
```

Example:

```text
Products/
  BMW/
    X5 G05/
      Lighting/
        Laser Headlight Modules/
          63119498407.webp
```

The importer understands that this product has:

- brand: BMW
- compatible model: X5 G05
- category: Lighting
- part type: Laser Headlight Modules
- product code: 63119498407

### 3. Brand folder

Use the public brand name consistently.

Good examples:

```text
Audi
BMW
Mercedes-Benz
MINI
Porsche
Volkswagen
```

Do not create different spellings for the same brand, such as `Mercedes`, `Mercedes Benz`, and
`Mercedes-Benz`. Choose the existing website spelling.

### 4. Vehicle-model folder

Use the model and chassis/platform code when known.

Good examples:

```text
A4 B9
Q5 FY
X5 G05
7 Series G12
C-Class W205
911 992
```

If the exact model is unknown, use exactly:

```text
Unverified Model
```

The importer will mark that product as **Needs review** instead of guessing.

If one module is shared between several vehicles, use a clear shared-platform name:

```text
Cayenne 958 - Touareg II Shared
```

Shared-platform products are also marked for review.

### 5. Website-category folder

Use the same category name that exists in the admin panel.

Examples:

```text
Lighting
Control Unit
Steering Wheels
Engine & Transmission
Retrofit Adapter
Axles & Suspension
```

Spelling should remain consistent. If a new category is necessary, create it in the admin panel
first or verify the automatically created category after import.

### 6. Part-type folder

The part-type folder describes the product more precisely and is used to prepare its initial title.

Recommended lighting part types:

```text
Headlight Control Modules
LED Driver Modules
LED Light Source Modules
Full LED Module Sets
Matrix LED Modules
Laser Headlight Modules
Xenon Ballasts
Headlight Adjustment Motors
Headlight Modules - Type Unverified
```

For other website categories, use a short and consistent technical name, for example:

```text
Engine Control Units
Transmission Control Units
Steering Wheel Controls
Suspension Control Modules
Retrofit Harness Adapters
```

If the part type is uncertain, add `Type Unverified` to its folder name. This makes the uncertainty
visible during review.

### 7. Image filename

Name each image using the product's primary OEM/part code:

```text
63119498407.webp
4M0907397AB.webp
A2059005010.webp
```

Rules:

- One filename must represent one product code.
- Product codes must be unique on the website.
- Do not name files `IMG_001`, `photo`, `new`, or `copy` when a product code is known.
- Keep useful letters, numbers, hyphens, and spaces from the real code.
- Do not add notes such as `(final)`, `(copy)`, or `(2)` to a product code.
- If several replacement codes belong to one product, use the primary code as the filename and add
  the other codes to **Replacement codes** after import.

### 8. Image requirements

Accepted source formats:

```text
JPG / JPEG
PNG
WebP
```

Requirements:

- Maximum source-file size: 20 MB.
- Use a clear product photograph with readable labels where possible.
- Do not include the same photograph more than once.
- Remove unrelated screenshots, documents, contact sheets, and thumbnails.
- Keep only product images inside `Products`.

The admin panel automatically:

- corrects image orientation;
- resizes the image to a maximum of 1920 px;
- converts it to optimized WebP;
- creates a separate 640 px thumbnail.

### 9. Complete examples

Known product:

```text
Products/Audi/Q5 FY/Lighting/Headlight Control Modules/80A907397A.webp
```

Unknown BMW application:

```text
Products/BMW/Unverified Model/Lighting/Headlight Modules - Type Unverified/63117440875.webp
```

Mercedes-Benz control unit:

```text
Products/Mercedes-Benz/E-Class W213/Control Unit/Engine Control Units/A2139005010.webp
```

### 10. Uploading the prepared folder

1. Sign in to the website admin panel.
2. Open **Batch import**.
3. Click **Select Products folder**.
4. Select the main `Products` folder—not an individual brand folder.
5. Wait until analysis finishes.
6. Open the **Needs review** filter.
7. Correct uncertain models, categories, codes, and Georgian titles.
8. Uncheck anything that should not be published yet.
9. Click **Import selected products**.
10. Keep the browser page open until processing finishes.
11. Correct and retry any rows marked **Failed**.

Important: selecting the folder does not publish anything. Products are created only after pressing
**Import selected products**.

---

## ქართული ინსტრუქცია

### 1. მთავარი საქაღალდის შექმნა

შექმენით საქაღალდე ზუსტად ამ სახელით:

```text
Products
```

ჯგუფური იმპორტისთვის განკუთვნილი ყველა სურათი ამ საქაღალდეში უნდა იყოს მოთავსებული.

### 2. აუცილებელი სტრუქტურა

ყოველი პროდუქტის სურათი დაალაგეთ შემდეგი სტრუქტურით:

```text
Products/
  ბრენდი/
    ავტომობილის მოდელი ან პლატფორმა/
      ვებსაიტის კატეგორია/
        ნაწილის ტიპი/
          პროდუქტის-კოდი.webp
```

მაგალითი:

```text
Products/
  BMW/
    X5 G05/
      Lighting/
        Laser Headlight Modules/
          63119498407.webp
```

იმპორტერი ავტომატურად ამოიცნობს:

- ბრენდს: BMW
- თავსებად მოდელს: X5 G05
- კატეგორიას: Lighting
- ნაწილის ტიპს: Laser Headlight Modules
- პროდუქტის კოდს: 63119498407

### 3. ბრენდის საქაღალდე

ყოველთვის გამოიყენეთ ვებსაიტზე არსებული ბრენდის ზუსტი სახელი.

მაგალითად:

```text
Audi
BMW
Mercedes-Benz
MINI
Porsche
Volkswagen
```

ერთი ბრენდისთვის არ გამოიყენოთ რამდენიმე განსხვავებული წერა, მაგალითად `Mercedes`,
`Mercedes Benz` და `Mercedes-Benz`.

### 4. ავტომობილის მოდელის საქაღალდე

თუ ცნობილია, მიუთითეთ მოდელი და შასის/პლატფორმის კოდი:

```text
A4 B9
Q5 FY
X5 G05
7 Series G12
C-Class W205
911 992
```

თუ ზუსტი მოდელი უცნობია, გამოიყენეთ ზუსტად:

```text
Unverified Model
```

ასეთი პროდუქტი ავტომატურად მოინიშნება როგორც **შესამოწმებელი** და სისტემა მოდელს არ გამოიცნობს.

თუ ნაწილი რამდენიმე ავტომობილზე გამოიყენება, დაწერეთ მკაფიო საერთო პლატფორმის სახელი:

```text
Cayenne 958 - Touareg II Shared
```

### 5. ვებსაიტის კატეგორიის საქაღალდე

გამოიყენეთ ადმინისტრატორის პანელში არსებული კატეგორიის იგივე სახელი.

მაგალითად:

```text
Lighting
Control Unit
Steering Wheels
Engine & Transmission
Retrofit Adapter
Axles & Suspension
```

სახელი ყოველთვის ერთნაირად უნდა დაიწეროს. ახალი კატეგორიის საჭიროების შემთხვევაში ჯერ შექმენით ის
ადმინისტრატორის პანელში ან იმპორტის შემდეგ გადაამოწმეთ ავტომატურად შექმნილი კატეგორია.

### 6. ნაწილის ტიპის საქაღალდე

ეს საქაღალდე უფრო ზუსტად აღწერს პროდუქტს და გამოიყენება საწყისი სათაურის შესაქმნელად.

ფარების კატეგორიის რეკომენდებული ტიპები:

```text
Headlight Control Modules
LED Driver Modules
LED Light Source Modules
Full LED Module Sets
Matrix LED Modules
Laser Headlight Modules
Xenon Ballasts
Headlight Adjustment Motors
Headlight Modules - Type Unverified
```

თუ ნაწილის ტიპი უცნობია, საქაღალდის სახელს დაუმატეთ `Type Unverified`.

### 7. სურათის ფაილის სახელი

სურათს დაარქვით პროდუქტის ძირითადი OEM/ნაწილის კოდი:

```text
63119498407.webp
4M0907397AB.webp
A2059005010.webp
```

წესები:

- ერთი ფაილის სახელი უნდა აღნიშნავდეს ერთ პროდუქტის კოდს.
- პროდუქტის კოდი ვებსაიტზე უნიკალური უნდა იყოს.
- თუ კოდი ცნობილია, არ გამოიყენოთ სახელები `IMG_001`, `photo`, `new` ან `copy`.
- კოდს არ დაუმატოთ `(final)`, `(copy)` ან `(2)`.
- თუ პროდუქტს რამდენიმე შემცვლელი კოდი აქვს, ფაილის სახელად გამოიყენეთ ძირითადი კოდი, ხოლო სხვა
  კოდები იმპორტის შემდეგ ჩაწერეთ ველში **Replacement codes**.

### 8. სურათის მოთხოვნები

დაშვებული ფორმატებია:

```text
JPG / JPEG
PNG
WebP
```

მოთხოვნები:

- საწყისი ფაილის მაქსიმალური ზომა: 20 MB.
- გამოიყენეთ მკაფიო ფოტო; სასურველია ნაწილის წარწერა/სტიკერი იკითხებოდეს.
- ერთი და იგივე ფოტო რამდენჯერმე არ დაამატოთ.
- წაშალეთ შეუსაბამო სქრინშოტები, დოკუმენტები, საკონტაქტო ფურცლები და პატარა thumbnails.
- `Products` საქაღალდეში დატოვეთ მხოლოდ პროდუქტის სურათები.

ადმინისტრატორის პანელი ავტომატურად:

- ასწორებს სურათის ორიენტაციას;
- ამცირებს მაქსიმუმ 1920 პიქსელამდე;
- გარდაქმნის ოპტიმიზებულ WebP ფორმატში;
- ქმნის ცალკე 640 პიქსელიან thumbnail-ს.

### 9. სრული მაგალითები

ცნობილი პროდუქტი:

```text
Products/Audi/Q5 FY/Lighting/Headlight Control Modules/80A907397A.webp
```

BMW-ის პროდუქტი უცნობი მოდელით:

```text
Products/BMW/Unverified Model/Lighting/Headlight Modules - Type Unverified/63117440875.webp
```

Mercedes-Benz-ის მართვის ბლოკი:

```text
Products/Mercedes-Benz/E-Class W213/Control Unit/Engine Control Units/A2139005010.webp
```

### 10. მომზადებული საქაღალდის ატვირთვა

1. შედით ვებსაიტის ადმინისტრატორის პანელში.
2. გახსენით **ჯგუფური იმპორტი**.
3. დააჭირეთ **Products საქაღალდის არჩევა**.
4. აირჩიეთ მთავარი `Products` საქაღალდე და არა მხოლოდ ერთი ბრენდის საქაღალდე.
5. დაელოდეთ ანალიზის დასრულებას.
6. გახსენით ფილტრი **შესამოწმებელი**.
7. შეასწორეთ გაურკვეველი მოდელები, კატეგორიები, კოდები და ქართული სათაურები.
8. მოხსენით მონიშვნა პროდუქტებს, რომლებიც ჯერ არ უნდა გამოქვეყნდეს.
9. დააჭირეთ **არჩეული პროდუქტების იმპორტი**.
10. დამუშავების დასრულებამდე ბრაუზერის გვერდი არ დახუროთ.
11. შეასწორეთ და ხელახლა სცადეთ **შეცდომით** მონიშნული ჩანაწერები.

მნიშვნელოვანია: საქაღალდის არჩევა პროდუქტებს არ აქვეყნებს. პროდუქტები იქმნება მხოლოდ ღილაკზე
**არჩეული პროდუქტების იმპორტი** დაჭერის შემდეგ.
