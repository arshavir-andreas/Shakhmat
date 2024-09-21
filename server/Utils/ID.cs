using IdGen;

namespace Server.Utils {
    public class ID {
        public static long GenerateID() {
            var structure = new IdStructure(45, 2, 16);

            var generator = new IdGenerator(2, new IdGeneratorOptions {
                IdStructure = structure,
                TimeSource = new DefaultTimeSource(new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)),
            });

            return generator.CreateId();
        }
    }
}
