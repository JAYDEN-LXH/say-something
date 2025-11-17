import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm"

const SUPABASE_ANONKEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwdHJkcGV5bXdwZGV3cHp1ZnVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxNTc1MjUsImV4cCI6MjA3ODczMzUyNX0.1O5a8qNFqJDsUrQXVRmvvKuGK4W1FGmm5m7dgiYQwnA"
const SUPABASE_URL = "https://sptrdpeymwpdewpzufuj.supabase.co"

const supabase = createClient(SUPABASE_URL, SUPABASE_ANONKEY)

const inputBox = document.getElementById('postBox');
const errorMsg = document.getElementById('error');
const successMsg = document.getElementById('success');
const submitBtn = document.getElementById('submit');

function isBlank(str) {
  return !str || str.trim() === "";
}

async function submit() {
    const inputBoxValue = inputBox.value;
    const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('post', inputBoxValue);
    
    if (error) {
        console.error(error);
    }

    if (data.length === 0) {
        // filter value first
        if (isBlank(inputBoxValue)) {
            errorMsg.textContent = "Cannot be blank!"
            errorMsg.style.display = 'inline-block';
        } else {
            errorMsg.style.display = 'none';
            errorMsg.textContent = "⚠️ That's already been posted.";
        };

        const { data: insertData, error: insertError } = await supabase
            .from('posts')
            .insert([
                { post: inputBoxValue }
            ]);

        if (insertError) {
            console.error(insertError);
        } else {
            // insert success
            errorMsg.style.display = 'none';
            successMsg.style.display = 'inline-block';
            setTimeout(() => { successMsg.style.display='none'; }, 3000)
        }
    } else {
        // the post exist
        errorMsg.style.display = 'inline-block';
        successMsg.style.display = 'none';
    }
}

submitBtn.addEventListener('click', submit);
inputBox.addEventListener('keydown', (event) => {
    if (event.key === "Enter") {
        submitBtn.click();
    }
})